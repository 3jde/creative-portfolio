'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  AudioLines,
  VolumeX,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Mouse,
  Move,
  Flag,
  Sparkles,
  Trophy,
  X,
  Feather,
  Settings2,
  CircleHelp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { CourtScene, Outfit, ViewState } from '@/lib/game/scene';
import type { Level } from '@/lib/game/model';
import { registerGameTools } from '@/lib/game/webmcp';
const initial: ViewState = {
  phase: 'ready',
  score: [0, 0],
  rally: 0,
  best: 0,
  message: '准备好，来一场轻盈的对决',
  power: 0,
  near: false,
  canHit: false,
};
const levelNames = { easy: '轻松入门', normal: '认真过招', hard: '高手对决' };
const colors = [
  { value: '#dca18d', name: '蜜桃粉' },
  { value: '#94b8a0', name: '抹茶绿' },
  { value: '#a8a9cc', name: '香芋紫' },
  { value: '#d9ba76', name: '奶油黄' },
];
function Portrait({ outfit }: { outfit: Outfit }) {
  return (
    <svg viewBox="0 0 180 170" aria-label="对手外观预览">
      <ellipse cx="90" cy="156" rx="52" ry="7" fill="#d8decb" />
      <path
        d="M59 161 Q49 112 71 105 L109 105 Q130 120 121 161"
        fill={outfit.color}
      />
      {outfit.style === 'skirt' && (
        <path d="M59 139 L45 163 H136 L120 139" fill={outfit.color} />
      )}
      <path d="M85 116V152H95V116" fill="#fff6df" />
      {outfit.style === 'hoodie' && (
        <path
          d="M68 112Q90 136 112 112"
          fill="none"
          stroke="#fff3da"
          strokeWidth="7"
        />
      )}
      <ellipse cx="90" cy="76" rx="44" ry="45" fill="#edc5a5" />
      <path
        d="M47 77Q36 19 88 23Q146 18 134 79L121 59Q95 76 72 53Q62 72 47 77"
        fill="#645348"
      />
      {outfit.gender === 'female' && (
        <>
          <ellipse cx="44" cy="88" rx="12" ry="27" fill="#645348" />
          <ellipse cx="136" cy="88" rx="12" ry="27" fill="#645348" />
          <circle cx="43" cy="66" r="6" fill="#e4c377" />
          <circle cx="137" cy="66" r="6" fill="#e4c377" />
        </>
      )}
      <ellipse cx="73" cy="82" rx="4" ry="6" fill="#41463d" />
      <ellipse cx="107" cy="82" rx="4" ry="6" fill="#41463d" />
      <ellipse cx="61" cy="96" rx="8" ry="4" fill="#dc9c8b" />
      <ellipse cx="119" cy="96" rx="8" ry="4" fill="#dc9c8b" />
      <path
        d="M83 98Q90 105 97 98"
        fill="none"
        stroke="#976653"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g transform="translate(145 125) rotate(24)">
        <ellipse
          cy="-14"
          rx="16"
          ry="21"
          fill="none"
          stroke="#71947b"
          strokeWidth="4"
        />
        <path
          d="M-12-23H12M-15-15H15M-12-7H12M-6-32V4M2-33V5M9-29V1M0 8V40"
          stroke="#8da791"
          strokeWidth="2"
        />
        <path
          d="M0 34V47"
          stroke="#bd916d"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
export default function Home() {
  const host = useRef<HTMLDivElement>(null),
    game = useRef<CourtScene | null>(null),
    helpDialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState(initial),
    [level, setLevel] = useState<Level>('easy'),
    [outfit, setOutfit] = useState<Outfit>({
      gender: 'female',
      style: 'sport',
      color: colors[0].value,
    });
  const [loaded, setLoaded] = useState(false),
    [error, setError] = useState(''),
    [sound, setSound] = useState(true),
    [help, setHelp] = useState(false),
    [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import('@/lib/game/scene')
      .then(({ CourtScene }) => {
        if (cancelled || !host.current) return;
        try {
          game.current = new CourtScene(host.current, setView);
          setLoaded(true);
        } catch (e) {
          console.error(e);
          setError('球场未能加载，请使用支持 WebGL 的浏览器，并开启硬件加速。');
        }
      })
      .catch(() => setError('游戏加载失败，请刷新页面重试。'));
    return () => {
      cancelled = true;
      game.current?.dispose();
      game.current = null;
    };
  }, []);
  useEffect(() => {
    if (game.current) game.current.setOutfit(outfit);
  }, [outfit, loaded]);
  useEffect(() => {
    if (loaded && game.current)
      return registerGameTools(game.current, setLevel);
  }, [loaded]);
  useEffect(() => {
    if (help) helpDialog.current?.showModal();
  }, [help]);
  useEffect(() => {
    if (game.current) game.current.sound = sound;
  }, [sound, loaded]);
  const active = view.phase === 'playing' || view.phase === 'paused';
  function start() {
    game.current?.start(level);
  }
  function pause() {
    if (view.phase === 'playing') game.current?.blur();
    else {
      game.current?.match.resume();
      game.current?.send();
    }
  }
  function soundToggle() {
    setSound(!sound);
    if (game.current) game.current.sound = !sound;
  }
  function helpOpen() {
    if (view.phase === 'playing') game.current?.blur();
    setHelp(true);
  }
  return (
    <main className={'game-shell' + (expanded ? ' expanded' : '')}>
      <header className="topbar">
        <Link href="/" className="brand" aria-label="羽众不同首页">
          <span className="brand-icon">
            <Feather size={23} />
          </span>
          <span>
            羽众不同<small>FEATHER CLUB</small>
          </span>
        </Link>
        <div className="header-center">
          <span className="live-dot" />
          把快乐，轻轻击回去。
        </div>
        <Button variant="ghost" className="help-btn" onClick={helpOpen}>
          <CircleHelp size={17} /> 玩法指南 <ArrowUpRight size={15} />
        </Button>
      </header>
      <section className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE MATCH. A LOT OF JOY.</div>
          <h1>
            今天，也要羽众不同<span>。</span>
          </h1>
          <p>握好球拍，和可爱的对手来一场轻盈对决。</p>
        </div>
        <div className="weather">
          <span className="sun-mark" />
          晴天，宜打球<span>薄荷公园 · 01 号球场</span>
        </div>
      </section>
      <div className="play-layout">
        <section className={'arena ' + (active ? 'in-match' : '')}>
          <div ref={host} className="court-canvas" />
          <div className="arena-top">
            <div className="court-label">
              <span className="live-dot" />
              薄荷公园<small>休闲单打</small>
            </div>
            <div className="arena-actions">
              <Button
                variant="ghost"
                size="icon"
                title={sound ? '关闭音效' : '开启音效'}
                aria-label={sound ? '关闭音效' : '开启音效'}
                onClick={soundToggle}
              >
                {sound ? <AudioLines /> : <VolumeX />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title={expanded ? '退出专注模式' : '专注模式'}
                aria-label={expanded ? '退出专注模式' : '专注模式'}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <Minimize2 /> : <Maximize2 />}
              </Button>
              {active && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={view.phase === 'paused' ? '继续比赛' : '暂停比赛'}
                  onClick={pause}
                >
                  {view.phase === 'paused' ? <Play /> : <Pause />}
                </Button>
              )}
            </div>
          </div>
          {active && (
            <div className="scoreboard">
              <div>
                你<b>{view.score[0]}</b>
              </div>
              <span>
                11 分制<small>VS</small>
              </span>
              <div>
                小羽<b>{view.score[1]}</b>
              </div>
            </div>
          )}
          {view.phase === 'ready' && (
            <div className="welcome">
              <span className="pill">
                <Sparkles size={13} /> 一场刚刚好的快乐
              </span>
              <h2>
                风很轻。
                <br />
                来打一场吧。
              </h2>
              <p>你的球拍，你的节奏。</p>
              <Button
                className="primary-btn"
                onClick={start}
                disabled={!loaded || !!error}
              >
                <Play size={17} fill="currentColor" />
                {loaded ? '开始比赛' : '正在准备球场…'}
                <ArrowRight size={18} />
              </Button>
              <span className="welcome-note">
                第一人称视角 · 鼠标操控 · 先得 11 分获胜
              </span>
            </div>
          )}
          {error && (
            <div className="error-box" role="alert">
              {error}
              <Button onClick={() => window.location.reload()}>重新加载</Button>
            </div>
          )}
          {active && (
            <>
              <div className="rally-badge">
                当前回合 <b>{String(view.rally).padStart(2, '0')}</b>
              </div>
              <div className={'hit-tip ' + (view.canHit ? 'hot' : '')}>
                {view.canHit ? '就是现在，松开左键！' : view.message}
              </div>
              <div className="power-panel">
                <div>
                  <span>击球力量</span>
                  <b>
                    {Math.round(view.power * 100)}
                    <small> %</small>
                  </b>
                </div>
                <div className="power-track">
                  <i style={{ width: `${view.power * 100}%` }} />
                </div>
                <small>
                  {view.power > 0.88
                    ? '蓄力完成 · 看准来球松开'
                    : '按住左键蓄力，松开挥拍'}
                </small>
              </div>
              <div className={'target-panel ' + (view.near ? 'near' : '')}>
                <Flag size={17} />
                <div>
                  {view.near ? '近网吊球' : '底线高远球'}
                  <small>
                    {view.near ? '松开右键，恢复底线' : '按住右键，切换近网'}
                  </small>
                </div>
              </div>
            </>
          )}
          {view.phase === 'ready' && (
            <div className="arena-caption">
              <span className="mini-line" />
              慢一点，也可以很精彩。<span>EST. 2026</span>
            </div>
          )}
          {(view.phase === 'paused' || view.phase === 'over') && (
            <div className="game-overlay">
              <div className="result-card">
                <span className="result-icon">
                  {view.phase === 'over' ? (
                    <Trophy size={30} />
                  ) : (
                    <Pause size={28} />
                  )}
                </span>
                <div className="eyebrow">
                  {view.phase === 'over'
                    ? 'A LOVELY MATCH'
                    : 'TAKE A LITTLE BREAK'}
                </div>
                <h2>
                  {view.phase === 'paused'
                    ? '休息一下，快乐继续'
                    : view.score[0] >= 11
                      ? '好球，你赢啦！'
                      : '差一点，再来一场'}
                </h2>
                <p>
                  {view.phase === 'paused'
                    ? '球场会等你，准备好了就回来。'
                    : `${view.score[0]} : ${view.score[1]}　·　最长回合 ${view.best} 拍`}
                </p>
                {view.phase === 'paused' && (
                  <Button className="primary-btn" onClick={pause}>
                    <Play size={17} />
                    继续比赛
                  </Button>
                )}
                <Button
                  className={
                    view.phase === 'over' ? 'primary-btn' : 'secondary-btn'
                  }
                  onClick={start}
                >
                  <RotateCcw size={16} />
                  {view.phase === 'over' ? '再来一场' : '重新开始'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (game.current) {
                      game.current.match.phase = 'ready';
                      game.current.match.flight = null;
                      game.current.send();
                    }
                  }}
                >
                  返回准备区
                </Button>
              </div>
            </div>
          )}
        </section>
        <aside className="settings">
          <div className="settings-title">
            <div>
              <span className="eyebrow">YOUR MATCH</span>
              <h2>遇见你的对手</h2>
            </div>
            <Settings2 size={19} />
          </div>
          <div className="opponent-preview">
            <span className="opponent-tag">AI 球友</span>
            <Portrait outfit={outfit} />
            <div>
              <b>小羽</b>
              <span>
                {level === 'easy'
                  ? '“慢慢来，我陪你热身。”'
                  : level === 'normal'
                    ? '“准备好了吗？认真咯。”'
                    : '“让我看看你的绝招！”'}
              </span>
            </div>
          </div>
          <fieldset disabled={active}>
            <legend>
              <span>01</span>对手难度
            </legend>
            <div className="difficulty-options">
              {(['easy', 'normal', 'hard'] as Level[]).map((l, i) => (
                <button
                  key={l}
                  aria-pressed={level === l}
                  className={level === l ? 'selected' : ''}
                  onClick={() => setLevel(l)}
                >
                  <span className="difficulty-bars">
                    {[0, 1, 2].map((n) => (
                      <i key={n} className={n <= i ? 'filled' : ''} />
                    ))}
                  </span>
                  {['新手', '普通', '高手'][i]}
                </button>
              ))}
            </div>
            <p className="field-note">
              {level === 'easy'
                ? '慢一点的来球，多一点从容。'
                : level === 'normal'
                  ? '更快的脚步，更有变化的回球。'
                  : '敏捷追球，考验你的击球时机。'}
            </p>
          </fieldset>
          <fieldset disabled={active}>
            <legend>
              <span>02</span>角色外观
            </legend>
            <div className="gender-options">
              <button
                aria-pressed={outfit.gender === 'female'}
                className={outfit.gender === 'female' ? 'selected' : ''}
                onClick={() => setOutfit({ ...outfit, gender: 'female' })}
              >
                女生
              </button>
              <button
                aria-pressed={outfit.gender === 'male'}
                className={outfit.gender === 'male' ? 'selected' : ''}
                onClick={() => setOutfit({ ...outfit, gender: 'male' })}
              >
                男生
              </button>
            </div>
          </fieldset>
          <fieldset disabled={active}>
            <legend>
              <span>03</span>今日穿搭
            </legend>
            <div className="outfit-options">
              {(['sport', 'skirt', 'hoodie'] as const).map((s, i) => (
                <button
                  key={s}
                  aria-pressed={outfit.style === s}
                  className={outfit.style === s ? 'selected' : ''}
                  onClick={() => setOutfit({ ...outfit, style: s })}
                >
                  {['运动套装', '轻盈裙装', '休闲卫衣'][i]}
                </button>
              ))}
            </div>
            <div className="color-row">
              <span>心情色彩</span>
              <div>
                {colors.map((c) => (
                  <button
                    key={c.value}
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={outfit.color === c.value}
                    className={
                      'swatch ' + (outfit.color === c.value ? 'selected' : '')
                    }
                    style={{ background: c.value }}
                    onClick={() => setOutfit({ ...outfit, color: c.value })}
                  />
                ))}
              </div>
            </div>
          </fieldset>
          <div className="settings-footer">
            <span className="live-dot" />
            {active
              ? '比赛中 · 返回准备区可更换设置'
              : `${levelNames[level]} · 11 分一局`}
          </div>
        </aside>
      </div>
      <section className="controls-strip">
        <div>
          <span className="control-icon">
            <Move size={21} />
          </span>
          <div>
            <b>移动鼠标</b>
            <p>跟随来球，控制球拍</p>
          </div>
        </div>
        <div>
          <span className="control-icon">
            <Mouse size={21} />
            <i className="left-mouse" />
          </span>
          <div>
            <b>左键蓄力</b>
            <p>按住积蓄力量，松开击球</p>
          </div>
        </div>
        <div>
          <span className="control-icon">
            <Mouse size={21} />
            <i className="right-mouse" />
          </span>
          <div>
            <b>右键变线</b>
            <p>按住打近网，松开打底线</p>
          </div>
        </div>
        <div className="gentle-note">
          <Feather size={18} />
          <p>
            不必每一拍都用力，
            <br />
            找到属于你的节奏。
          </p>
        </div>
      </section>
      <footer className="page-footer">
        <span>羽众不同 · 让快乐多飞一会儿</span>
        <span>为鼠标与大屏幕而设计</span>
      </footer>
      {help && (
        <dialog
          ref={helpDialog}
          className="help-overlay"
          aria-labelledby="help-title"
          onClose={() => setHelp(false)}
        >
          <section className="help-card">
            <Button
              variant="ghost"
              size="icon"
              className="close-help"
              aria-label="关闭玩法指南"
              onClick={() => setHelp(false)}
            >
              <X />
            </Button>
            <span className="eyebrow">HOW TO PLAY</span>
            <h2 id="help-title">你的第一场羽毛球</h2>
            <ol>
              <li>
                <b>先选一位球友</b>
                <p>难度决定反应速度与回球能力，外观不影响实力。</p>
              </li>
              <li>
                <b>跟住球，提前蓄力</b>
                <p>
                  鼠标移动球拍，按住左键蓄力。球飞到你面前、提示亮起时松开，挥空不会自动接到球。
                </p>
              </li>
              <li>
                <b>用落点调动对手</b>
                <p>
                  鼠标左右位置决定回球方向。右键按住打近网，松开打底线。蓄力越久，球速越快。
                </p>
              </li>
              <li>
                <b>享受这一局</b>
                <p>
                  先得 11 分获胜。无需键盘跑位；Esc 暂停，切出窗口也会自动暂停。
                </p>
              </li>
            </ol>
            <Button className="primary-btn" onClick={() => setHelp(false)}>
              明白了，去球场
              <ArrowRight size={17} />
            </Button>
          </section>
        </dialog>
      )}
    </main>
  );
}
