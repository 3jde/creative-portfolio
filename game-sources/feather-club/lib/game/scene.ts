import * as T from 'three';
import { Match, powerFor, clamp } from './model';
export type Outfit = {
  gender: 'female' | 'male';
  style: 'sport' | 'skirt' | 'hoodie';
  color: string;
};
export type ViewState = {
  phase: string;
  score: [number, number];
  rally: number;
  best: number;
  message: string;
  power: number;
  near: boolean;
  canHit: boolean;
};
export class CourtScene {
  renderer: T.WebGLRenderer;
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(53, 1, 0.1, 120);
  match = new Match();
  host: HTMLElement;
  frame = 0;
  disposed = false;
  last = 0;
  time = 0;
  lastEvent = 0;
  notify: (s: ViewState) => void;
  playerRacket = new T.Group();
  rival = new T.Group();
  rivalArm = new T.Group();
  shuttle = new T.Group();
  shadow: T.Mesh;
  target: T.Mesh;
  pointer = new T.Vector2(0.42, -0.18);
  ray = new T.Raycaster();
  hitPlane = new T.Plane(new T.Vector3(0, 0, 1), -4.4);
  aim = new T.Vector3();
  charging = false;
  chargeTime = 0;
  near = false;
  swingTime = 0;
  sound = true;
  audio: AudioContext | null = null;
  observer: ResizeObserver;
  clouds: T.Group[] = [];
  trail: T.Mesh[] = [];
  sparks: { mesh: T.Mesh; v: T.Vector3; life: number }[] = [];
  lastNotify = 0;
  constructor(host: HTMLElement, notify: (s: ViewState) => void) {
    this.host = host;
    this.notify = notify;
    this.renderer = new T.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.setClearColor('#e8f2e8');
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.setAttribute(
      'aria-label',
      '第一人称羽毛球场：移动鼠标瞄准，左键蓄力松开击球，右键按住选择近网',
    );
    this.scene.fog = new T.Fog('#e8f2e8', 24, 65);
    this.camera.position.set(0, 3.4, 9.2);
    this.camera.lookAt(0, 1.5, -2);
    this.scene.add(new T.HemisphereLight('#fff9e9', '#99b7a6', 2.3));
    const sun = new T.DirectionalLight('#fff1d5', 3.2);
    sun.position.set(-7, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {
      left: -15,
      right: 15,
      top: 15,
      bottom: -15,
      far: 50,
    });
    sun.shadow.normalBias = 0.035;
    this.scene.add(sun);
    this.environment();
    this.makeCourt();
    this.setOutfit({ gender: 'female', style: 'sport', color: '#dca18d' });
    this.playerRacket = this.racket('#648c77', true);
    this.scene.add(this.playerRacket);
    this.makeShuttle();
    this.shadow = this.mesh(new T.CircleGeometry(0.25, 24), '#738d77');
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.055;
    this.scene.add(this.shadow);
    this.target = this.mesh(new T.RingGeometry(0.34, 0.39, 40), '#f6d58e');
    this.target.rotation.x = -Math.PI / 2;
    this.target.position.y = 0.06;
    this.scene.add(this.target);
    for (let i = 0; i < 12; i++) {
      const p = this.mesh(
        new T.SphereGeometry(0.035 * (1 - i / 14), 8, 6),
        '#fffde3',
      );
      p.visible = false;
      this.trail.push(p);
      this.scene.add(p);
    }
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.resize();
    host.addEventListener('pointermove', this.move);
    host.addEventListener('mousedown', this.down);
    window.addEventListener('mouseup', this.up);
    host.addEventListener('contextmenu', this.context);
    window.addEventListener('blur', this.blur);
    document.addEventListener('visibilitychange', this.visibility);
    window.addEventListener('keydown', this.key);
    this.frame = requestAnimationFrame(this.tick);
  }
  mat(color: string) {
    return new T.MeshStandardMaterial({ color, roughness: 0.8 });
  }
  mesh(geo: T.BufferGeometry, color: string) {
    const m = new T.Mesh(geo, this.mat(color));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  box(
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    color: string,
  ) {
    const m = this.mesh(new T.BoxGeometry(w, h, d), color);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  ball(
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    r: number,
    color: string,
    sx = 1,
    sy = 1,
    sz = 1,
  ) {
    const m = this.mesh(new T.SphereGeometry(r, 20, 14), color);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    parent.add(m);
    return m;
  }
  cylinder(
    parent: T.Object3D,
    x: number,
    y: number,
    z: number,
    r1: number,
    r2: number,
    h: number,
    color: string,
  ) {
    const m = this.mesh(new T.CylinderGeometry(r1, r2, h, 20), color);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  line(
    parent: T.Object3D,
    a: T.Vector3,
    b: T.Vector3,
    color: string,
    r = 0.009,
  ) {
    const d = b.clone().sub(a),
      m = this.mesh(new T.CylinderGeometry(r, r, d.length(), 6), color);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
    parent.add(m);
    return m;
  }
  textSign(text: string, bg: string, fg: string, w: number, h: number) {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 192;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = fg;
    ctx.font = '600 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 384, 96);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    return new T.Mesh(
      new T.PlaneGeometry(w, h),
      new T.MeshStandardMaterial({ map: tex, roughness: 0.9 }),
    );
  }
  makeCourt() {
    this.box(this.scene, 0, -0.15, 0, 7.4, 0.3, 14.2, '#8fc0aa');
    this.box(this.scene, 0, 0.006, 0, 6.1, 0.025, 13.4, '#86bda6');
    this.box(this.scene, 0, 0.022, 3.35, 5.18, 0.015, 6.7, '#90c6af');
    for (const x of [-3.05, -2.59, 2.59, 3.05])
      this.box(this.scene, x, 0.04, 0, 0.035, 0.012, 13.4, '#fff9df');
    for (const z of [-6.7, -5.94, -1.98, 1.98, 5.94, 6.7])
      this.box(this.scene, 0, 0.04, z, 6.1, 0.012, 0.035, '#fff9df');
    this.box(this.scene, 0, 0.04, -4.35, 0.035, 0.012, 4.7, '#fff9df');
    this.box(this.scene, 0, 0.04, 4.35, 0.035, 0.012, 4.7, '#fff9df');
    for (const x of [-3.35, 3.35]) {
      this.cylinder(this.scene, x, 0.8, 0, 0.055, 0.075, 1.6, '#f3f1dc');
      this.ball(this.scene, x, 1.63, 0, 0.085, '#d8a982');
      this.cylinder(this.scene, x, 0.08, 0, 0.22, 0.24, 0.16, '#477d67');
    }
    const net = new T.Group();
    for (let x = -3.3; x <= 3.3; x += 0.15)
      this.line(
        net,
        new T.Vector3(x, 0.64, 0),
        new T.Vector3(x, 1.55, 0),
        '#e6e9d7',
        0.005,
      );
    for (let y = 0.64; y <= 1.55; y += 0.13)
      this.line(
        net,
        new T.Vector3(-3.3, y, 0),
        new T.Vector3(3.3, y, 0),
        '#e6e9d7',
        0.005,
      );
    this.box(net, 0, 1.56, 0, 6.65, 0.07, 0.04, '#fff7e2');
    this.box(net, 0, 0.64, 0, 6.65, 0.025, 0.025, '#d9e2cb');
    this.scene.add(net);
    const logo = this.textSign('FEATHER CLUB', '#86bda6', '#d7ebd8', 2, 0.5);
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(0, 0.041, -5);
    this.scene.add(logo);
  }
  environment() {
    this.box(this.scene, 0, -0.37, 0, 160, 0.25, 160, '#d4dfc0');
    this.box(this.scene, 0, -0.2, 0, 10, 0.13, 17, '#e8dcc1');
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2,
        x = Math.cos(a) * (11 + (i % 3) * 2),
        z = Math.sin(a) * 13 - 2,
        tree = new T.Group();
      tree.position.set(x, 0, z);
      const h = 2.7 + (i % 3) * 0.65;
      this.cylinder(tree, 0, h / 2, 0, 0.12, 0.18, h, '#b69b7d');
      this.ball(tree, 0, h, 0, 1.4, i % 2 ? '#a6bfa0' : '#b5caaa', 1, 1.28, 1);
      this.ball(tree, -0.6, h - 0.3, 0.15, 0.85, '#b4caa3');
      this.scene.add(tree);
    }
    for (let i = 0; i < 7; i++) {
      const cloud = new T.Group();
      cloud.position.set((i - 3) * 8, 9 + (i % 3) * 1.5, -18 - (i % 2) * 5);
      for (let k = 0; k < 3; k++)
        this.ball(
          cloud,
          (k - 1) * 1.1,
          k === 1 ? 0.3 : 0,
          0,
          0.95,
          '#fffaf0',
          1.4,
          0.65,
          1,
        );
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
    for (const x of [-5.5, 5.5]) {
      this.box(this.scene, x, 0.42, -2.8, 0.8, 0.16, 2.4, '#d4b08e');
      this.box(
        this.scene,
        x + Math.sign(x) * 0.32,
        0.87,
        -2.8,
        0.1,
        0.65,
        2.4,
        '#dec3a1',
      );
      for (const z of [-3.6, -2])
        this.box(this.scene, x, 0.2, z, 0.6, 0.4, 0.12, '#9b9f89');
    }
    const sign = this.textSign('羽 众 不 同', '#f4e5c9', '#487561', 4.2, 1.05);
    sign.position.set(0, 2.65, -9);
    this.scene.add(sign);
    for (const x of [-2, 2])
      this.cylinder(this.scene, x, 1.2, -9, 0.05, 0.05, 2.4, '#b69b7d');
    for (let i = 0; i < 4; i++) {
      const x = i % 2 ? -5.5 : 5.5,
        z = -3.6 + Math.floor(i / 2) * 1.5;
      this.ball(
        this.scene,
        x,
        0.78,
        z,
        0.31,
        i % 2 ? '#eed2b5' : '#e4d9ca',
        1,
        1.1,
        1,
      );
      this.ball(this.scene, x, 1.15, z, 0.34, '#f7ecdb');
      this.ball(this.scene, x - 0.14, 1.54, z, 0.1, '#f7ecdb', 0.75, 2.2, 0.7);
      this.ball(this.scene, x + 0.14, 1.54, z, 0.1, '#f7ecdb', 0.75, 2.2, 0.7);
      for (const dx of [-0.1, 0.1])
        this.ball(this.scene, x + dx, 1.19, z + 0.3, 0.027, '#514f48');
      this.ball(this.scene, x, 1.08, z + 0.32, 0.035, '#d5a08c');
    }
    for (let i = 0; i < 55; i++) {
      const x = Math.sin(i * 97) * 14,
        z = Math.cos(i * 43) * 16;
      if (Math.abs(x) < 4.5 && Math.abs(z) < 8) continue;
      this.cylinder(this.scene, x, 0.1, z, 0.014, 0.018, 0.25, '#9aad88');
      this.ball(
        this.scene,
        x,
        0.25,
        z,
        0.07,
        ['#f1d29a', '#f1e4ca', '#d7a99e'][i % 3],
      );
    }
    const rope = new T.Group();
    this.line(
      rope,
      new T.Vector3(-8, 5, -8),
      new T.Vector3(8, 5, -8),
      '#c4b898',
      0.012,
    );
    for (let i = 0; i < 18; i++) {
      const shape = new T.Shape();
      shape.moveTo(-0.19, 0);
      shape.lineTo(0.19, 0);
      shape.lineTo(0, -0.42);
      shape.closePath();
      const flag = this.mesh(
        new T.ShapeGeometry(shape),
        ['#d7a693', '#ebd394', '#aac5af'][i % 3],
      );
      (flag.material as T.MeshStandardMaterial).side = T.DoubleSide;
      flag.position.set(-7.6 + i * 0.9, 5, -8);
      rope.add(flag);
    }
    this.scene.add(rope);
  }
  racket(color: string, hand = false) {
    const g = new T.Group(),
      hoop = this.mesh(new T.TorusGeometry(0.38, 0.027, 8, 44), color);
    hoop.scale.y = 1.28;
    g.add(hoop);
    for (let x = -0.3; x <= 0.31; x += 0.075) {
      const y = Math.sqrt(Math.max(0, 1 - (x * x) / (0.36 * 0.36))) * 0.455;
      this.line(
        g,
        new T.Vector3(x, -y, 0),
        new T.Vector3(x, y, 0),
        '#f8f1dc',
        0.004,
      );
    }
    for (let y = -0.4; y <= 0.41; y += 0.075) {
      const x = Math.sqrt(Math.max(0, 1 - (y * y) / (0.46 * 0.46))) * 0.35;
      this.line(
        g,
        new T.Vector3(-x, y, 0),
        new T.Vector3(x, y, 0),
        '#f8f1dc',
        0.004,
      );
    }
    this.cylinder(g, 0, -0.7, 0, 0.025, 0.025, 0.45, color);
    this.cylinder(g, 0, -1.03, 0, 0.053, 0.053, 0.28, '#d8b090');
    for (let i = 0; i < 5; i++)
      this.cylinder(g, 0, -0.92 - i * 0.045, 0, 0.055, 0.055, 0.012, '#f0d3b3');
    if (hand) {
      this.ball(g, 0.02, -1.09, 0.04, 0.105, '#f0c5a5', 1, 1.5, 1);
      this.cylinder(g, 0.06, -1.44, 0.08, 0.085, 0.11, 0.55, '#f0c5a5');
      this.cylinder(g, 0.06, -1.77, 0.08, 0.13, 0.15, 0.2, '#eee7cf');
    }
    return g;
  }
  setOutfit(outfit: Outfit) {
    this.scene.remove(this.rival);
    this.disposeObject(this.rival);
    this.rival = new T.Group();
    const g = this.rival,
      skin = '#f0c6a8',
      hair = '#675348';
    for (const x of [-0.17, 0.17]) {
      this.cylinder(g, x, 0.4, 0, 0.095, 0.09, 0.57, skin);
      this.ball(g, x, 0.13, 0.12, 0.15, '#fffae8', 1, 0.65, 1.65);
      this.cylinder(g, x, 0.26, 0, 0.101, 0.101, 0.18, '#f5f3e3');
    }
    if (outfit.style === 'skirt')
      this.cylinder(g, 0, 0.84, 0, 0.26, 0.43, 0.42, outfit.color);
    else {
      this.ball(g, -0.17, 0.76, 0, 0.2, '#677e75', 1, 1.15, 1);
      this.ball(g, 0.17, 0.76, 0, 0.2, '#677e75', 1, 1.15, 1);
    }
    this.ball(g, 0, 1.13, 0, 0.35, outfit.color, 1, 1.15, 0.7);
    if (outfit.style === 'hoodie') {
      this.ball(g, 0, 1.43, -0.1, 0.31, outfit.color);
      for (const x of [-0.07, 0.07])
        this.line(
          g,
          new T.Vector3(x, 1.39, 0.27),
          new T.Vector3(x, 1.14, 0.28),
          '#fff5dd',
          0.012,
        );
    } else {
      this.box(g, 0, 1.2, 0.256, 0.085, 0.31, 0.025, '#f7e9d3');
      this.cylinder(g, 0, 1.49, 0, 0.12, 0.15, 0.08, '#f8f2df');
    }
    this.ball(g, 0, 1.88, 0, 0.48, skin, 1, 1.03, 0.88);
    this.ball(g, 0, 2.13, -0.06, 0.46, hair, 1, 0.72, 0.95);
    for (let i = 0; i < 5; i++)
      this.ball(
        g,
        -0.32 + i * 0.16,
        2.15 - Math.sin(i) * 0.045,
        0.29,
        0.13,
        hair,
        1,
        1.2,
        0.6,
      );
    if (outfit.gender === 'female')
      for (const x of [-0.45, 0.45]) {
        this.ball(g, x, 1.86, -0.1, 0.18, hair, 0.8, 1.7, 0.9);
        this.ball(g, x, 2.02, 0.03, 0.072, '#ead298');
      }
    for (const x of [-0.15, 0.15]) {
      this.ball(g, x, 1.9, 0.398, 0.045, '#423e37', 0.85, 1.25, 0.5);
      this.ball(g, x - 0.008, 1.916, 0.418, 0.012, '#fff9e9');
      this.ball(g, x * 1.5, 1.79, 0.36, 0.075, '#e6a799', 1, 0.48, 0.25);
    }
    const curve = new T.EllipseCurve(
        0,
        0,
        0.075,
        0.045,
        Math.PI,
        Math.PI * 2,
        false,
        0,
      ),
      smile = new T.Line(
        new T.BufferGeometry().setFromPoints(curve.getPoints(18)),
        new T.LineBasicMaterial({ color: '#9b6554' }),
      );
    smile.position.set(0, 1.78, 0.421);
    g.add(smile);
    this.rivalArm = new T.Group();
    this.rivalArm.position.set(-0.32, 1.36, 0);
    this.cylinder(this.rivalArm, -0.13, -0.2, 0.06, 0.09, 0.08, 0.44, skin);
    const r = this.racket('#e1aa88');
    r.scale.setScalar(0.7);
    r.position.set(-0.18, 0.45, 0.12);
    r.rotation.z = -0.25;
    this.rivalArm.add(r);
    g.add(this.rivalArm);
    this.cylinder(g, 0.38, 1.12, 0.02, 0.09, 0.08, 0.5, skin);
    this.scene.add(g);
    g.position.set(this.match.opponent.x, 0, this.match.opponent.z);
  }
  makeShuttle() {
    this.ball(this.shuttle, 0, -0.12, 0, 0.082, '#f2dcaf');
    const cone = this.mesh(
      new T.CylinderGeometry(0.16, 0.045, 0.25, 12, 1, true),
      '#fffaf0',
    );
    cone.position.y = 0.04;
    (cone.material as T.MeshStandardMaterial).side = T.DoubleSide;
    this.shuttle.add(cone);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      this.line(
        this.shuttle,
        new T.Vector3(Math.cos(a) * 0.035, -0.09, Math.sin(a) * 0.035),
        new T.Vector3(Math.cos(a) * 0.16, 0.17, Math.sin(a) * 0.16),
        '#fffef5',
        0.008,
      );
    }
    this.scene.add(this.shuttle);
  }
  resize() {
    const w = this.host.clientWidth,
      h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  move = (e: MouseEvent) => {
    const b = this.host.getBoundingClientRect();
    this.pointer.set(
      ((e.clientX - b.left) / b.width) * 2 - 1,
      1 - ((e.clientY - b.top) / b.height) * 2,
    );
  };
  context = (e: Event) => e.preventDefault();
  down = (e: MouseEvent) => {
    if (this.match.phase !== 'playing') return;
    e.preventDefault();
    this.move(e);
    this.ensureAudio();
    if (e.button === 0) {
      this.charging = true;
      this.chargeTime = 0;
    }
    if (e.button === 2) this.near = true;
  };
  up = (e: MouseEvent) => {
    if (e.button === 2) this.near = false;
    if (e.button === 0 && this.charging) {
      this.charging = false;
      this.swingTime = 0.3;
      this.match.swing(this.aim, powerFor(this.chargeTime), this.near);
      this.tone(240, 0.065, 0.025);
      this.chargeTime = 0;
    }
  };
  blur = () => {
    this.charging = false;
    this.near = false;
    this.chargeTime = 0;
    this.match.pause();
    this.send();
  };
  visibility = () => {
    if (document.hidden) this.blur();
  };
  key = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !document.querySelector('dialog[open]')) {
      this.charging = false;
      this.near = false;
      this.chargeTime = 0;
      if (this.match.phase === 'playing') this.match.pause();
      else if (this.match.phase === 'paused') this.match.resume();
      this.send();
    }
  };
  ensureAudio() {
    if (!this.audio && window.AudioContext) this.audio = new AudioContext();
    if (this.audio?.state === 'suspended') void this.audio.resume();
  }
  tone(freq: number, duration = 0.13, volume = 0.06) {
    if (!this.sound || !this.audio) return;
    const osc = this.audio.createOscillator(),
      gain = this.audio.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audio.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      freq * 0.55,
      this.audio.currentTime + duration,
    );
    gain.gain.setValueAtTime(volume, this.audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audio.currentTime + duration,
    );
    osc.connect(gain);
    gain.connect(this.audio.destination);
    osc.start();
    osc.stop(this.audio.currentTime + duration);
  }
  start(level: Parameters<Match['start']>[0]) {
    this.ensureAudio();
    this.charging = false;
    this.chargeTime = 0;
    this.near = false;
    this.match.start(level);
    this.send();
  }
  send() {
    this.notify({
      phase: this.match.phase,
      score: [...this.match.score],
      rally: this.match.rally,
      best: this.match.best,
      message: this.match.message,
      power: this.charging ? powerFor(this.chargeTime) : 0,
      near: this.near,
      canHit: this.canHit(),
    });
  }
  canHit() {
    const b = this.match.ball;
    return (
      !!this.match.flight &&
      this.match.lastHitter === 'ai' &&
      b.z > 2.7 &&
      b.z < 5.9 &&
      Math.hypot(b.x - this.aim.x, b.y - this.aim.y) < 1
    );
  }
  lastEventId = 0;
  tick = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min((now - (this.last || now)) / 1000, 0.04);
    this.last = now;
    this.time += dt;
    if (this.charging && this.match.phase === 'playing') this.chargeTime += dt;
    this.match.update(dt);
    this.ray.setFromCamera(this.pointer, this.camera);
    this.ray.ray.intersectPlane(this.hitPlane, this.aim);
    this.aim.x = clamp(this.aim.x, -3.6, 3.6);
    this.aim.y = clamp(this.aim.y, 0.2, 4.5);
    this.swingTime = Math.max(0, this.swingTime - dt);
    this.playerRacket.position.set(
      this.aim.x,
      this.aim.y,
      4.4 - Math.sin((this.swingTime / 0.3) * Math.PI) * 0.7,
    );
    this.playerRacket.rotation.set(
      -Math.sin((this.swingTime / 0.3) * Math.PI) * 0.6,
      this.charging ? -0.35 * powerFor(this.chargeTime) : 0,
      -0.13 + this.pointer.x * 0.15,
    );
    this.playerRacket.visible = this.match.phase !== 'ready';
    this.rival.position.set(
      this.match.opponent.x,
      Math.sin(this.time * 3) * 0.025,
      this.match.opponent.z,
    );
    this.rival.rotation.y = Math.sin(this.time) * 0.05;
    this.rivalArm.rotation.x =
      this.match.eventType === 'return'
        ? Math.sin(
            (Math.max(0, 0.4 - (this.time - this.lastEvent)) / 0.4) * Math.PI,
          ) * -1.2
        : Math.sin(this.time * 2) * 0.08;
    this.shuttle.visible = !!this.match.flight;
    this.shuttle.position.set(
      this.match.ball.x,
      this.match.ball.y,
      this.match.ball.z,
    );
    this.shuttle.rotation.x = this.match.lastHitter === 'ai' ? -1.2 : 1.2;
    this.shuttle.rotation.z += dt * 2;
    this.shadow.visible = this.shuttle.visible;
    this.shadow.position.set(this.match.ball.x, 0.055, this.match.ball.z);
    this.shadow.scale.setScalar(0.65 + this.match.ball.y * 0.13);
    this.target.visible = this.match.phase === 'playing';
    this.target.position.set(
      clamp(this.aim.x * 1.35, -2.55, 2.55),
      0.061,
      this.near ? -1.85 : -5.65,
    );
    this.target.scale.setScalar(1 + Math.sin(this.time * 4) * 0.08);
    for (let i = this.trail.length - 1; i > 0; i--) {
      this.trail[i].position.lerp(this.trail[i - 1].position, 0.55);
      this.trail[i].visible = this.shuttle.visible;
    }
    this.trail[0].position.copy(this.shuttle.position);
    this.trail[0].visible = this.shuttle.visible;
    if (this.match.event !== this.lastEventId) {
      this.lastEventId = this.match.event;
      this.lastEvent = this.time;
      if (this.match.eventType === 'hit') {
        this.tone(680);
        this.burst(this.match.ball);
      } else if (this.match.eventType === 'return') this.tone(410, 0.1, 0.025);
      else if (this.match.eventType === 'winPoint') {
        this.tone(880, 0.28);
        this.burst({ x: 0, y: 2, z: 3 });
      } else if (this.match.eventType === 'losePoint')
        this.tone(190, 0.25, 0.025);
    }
    for (const p of this.sparks) {
      p.life -= dt;
      p.mesh.position.addScaledVector(p.v, dt);
      p.v.y -= dt * 2;
      p.mesh.scale.setScalar(Math.max(0, p.life));
    }
    this.sparks = this.sparks.filter((p) => {
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.disposeObject(p.mesh);
        return false;
      }
      return true;
    });
    this.clouds.forEach((c, i) => {
      c.position.x += Math.sin(this.time * 0.06 + i) * dt * 0.035;
    });
    this.renderer.render(this.scene, this.camera);
    if (now - this.lastNotify > 65) {
      this.send();
      this.lastNotify = now;
    }
    this.frame = requestAnimationFrame(this.tick);
  };
  burst(p: { x: number; y: number; z: number }) {
    for (let i = 0; i < 13; i++) {
      const mesh = this.mesh(
        new T.SphereGeometry(0.05, 6, 4),
        i % 2 ? '#f4d48c' : '#fff8e5',
      );
      mesh.position.set(p.x, p.y, p.z);
      this.scene.add(mesh);
      this.sparks.push({
        mesh,
        v: new T.Vector3(
          (Math.random() - 0.5) * 3,
          Math.random() * 2,
          (Math.random() - 0.5) * 2,
        ),
        life: 0.6,
      });
    }
  }
  disposeObject(obj: T.Object3D) {
    obj.traverse((o) => {
      if (o instanceof T.Mesh || o instanceof T.Line) {
        o.geometry.dispose();
        for (const mat of Array.isArray(o.material)
          ? o.material
          : [o.material]) {
          if ('map' in mat) (mat.map as T.Texture | null)?.dispose();
          mat.dispose();
        }
      }
    });
  }
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.host.removeEventListener('pointermove', this.move);
    this.host.removeEventListener('mousedown', this.down);
    window.removeEventListener('mouseup', this.up);
    this.host.removeEventListener('contextmenu', this.context);
    window.removeEventListener('blur', this.blur);
    document.removeEventListener('visibilitychange', this.visibility);
    window.removeEventListener('keydown', this.key);
    this.disposeObject(this.scene);
    this.renderer.dispose();
    this.renderer.domElement.remove();
    void this.audio?.close();
  }
}
