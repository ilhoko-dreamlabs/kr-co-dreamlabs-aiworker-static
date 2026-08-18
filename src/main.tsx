import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Github,
  Mail,
  MessageSquareText,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Workflow,
  Youtube
} from "lucide-react";
import "./styles.css";

const ASSET_HOST = "https://assets.dreamlabs.co.kr";

const highlights = [
  {
    icon: Workflow,
    title: "업무 실행 자동화",
    text: "반복 작업, 자료 정리, 배포 점검처럼 시간이 새는 운영 업무를 Worker가 절차화해 처리합니다."
  },
  {
    icon: ShieldCheck,
    title: "기준 중심 운영",
    text: "프로젝트별 지침, 승인 범위, 검증 결과를 분리해 공개 가능한 결과물만 남기도록 설계합니다."
  },
  {
    icon: Radio,
    title: "라이브 채널 확장",
    text: "Worker Live AI 유튜브와 SNS 채널을 통해 실제 활용 사례와 업데이트를 지속적으로 공개합니다."
  }
];

const posts = [
  {
    category: "Launch note",
    date: "2026.08.18",
    title: "DreamLabs Worker 대표 페이지를 공개합니다",
    excerpt:
      "worker.dreamlabs.co.kr은 DreamLabs의 대표 Worker를 소개하고, 활용 사례와 업데이트를 모아가는 공식 정적 허브입니다."
  },
  {
    category: "Use case",
    date: "Coming soon",
    title: "정적 사이트, 문서, 배포 검증을 한 흐름으로",
    excerpt:
      "기획 문구 작성부터 GitHub Pages 배포까지 Worker가 어떤 기준으로 작업을 이어가는지 사례 중심으로 정리할 예정입니다."
  },
  {
    category: "Channel",
    date: "Coming soon",
    title: "Worker Live AI 콘텐츠 로드맵",
    excerpt:
      "유튜브 쇼츠, 라이브 데모, SNS 카드뉴스를 연결해 실제 업무 자동화 장면을 더 자주 보여주는 채널 구조를 준비합니다."
  }
];

const links = [
  {
    label: "Worker Live AI",
    href: "https://www.youtube.com/@Worker-live-ai",
    icon: Youtube,
    active: true
  },
  {
    label: "GitHub Pages",
    href: "https://github.com/ilhoko-dreamlabs/kr-co-dreamlabs-aiworker-static",
    icon: Github,
    active: true
  },
  {
    label: "SNS 채널",
    href: "#channels",
    icon: MessageSquareText,
    active: false
  }
];

function App() {
  return (
    <main>
      <header className="site-header" aria-label="DreamLabs Worker">
        <a className="brand" href="#top" aria-label="DreamLabs Worker 홈">
          <img
            src={`${ASSET_HOST}/brand/dreamlabs/logos/dreamlabs-symbol-color.png`}
            alt=""
            width="34"
            height="34"
          />
          <span>DreamLabs Worker</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#features">기능</a>
          <a href="#posts">포스트</a>
          <a href="#channels">채널</a>
        </nav>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} />
            DreamLabs 대표 AI Worker
          </span>
          <h1 id="hero-title">일의 흐름을 끝까지 밀어주는 실행형 Worker</h1>
          <p>
            DreamLabs Worker는 기획, 문서화, 개발, 검증, 정적 배포까지 이어지는
            업무 흐름을 하나의 실행 단위로 정리합니다. 이 페이지는 Worker의 공개
            소개와 운영 소식을 모아가는 공식 랜딩 허브입니다.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="https://www.youtube.com/@Worker-live-ai">
              <Play size={18} />
              유튜브 채널 보기
            </a>
            <a className="secondary-action" href="#posts">
              포스트 읽기
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="worker-visual" aria-label="DreamLabs Worker 대표 이미지">
          <img
            className="worker-icon"
            src={`${ASSET_HOST}/agents/dreamlabs-worker/icon/dreamlabs-bot-icon.png`}
            alt="DreamLabs Worker 캐릭터 아이콘"
          />
          <div className="signal-panel">
            <Bot size={22} />
            <span>Plan · Build · Verify · Publish</span>
          </div>
        </div>
      </section>

      <section id="features" className="feature-band" aria-labelledby="features-title">
        <div className="section-heading">
          <span>Worker가 맡는 일</span>
          <h2 id="features-title">홍보 페이지 너머, 실제 실행 경험을 보여줍니다</h2>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <Icon size={24} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="posts" className="posts-section" aria-labelledby="posts-title">
        <div className="section-heading">
          <span>Worker Blog</span>
          <h2 id="posts-title">업데이트와 활용 사례</h2>
        </div>
        <div className="post-list">
          {posts.map((post) => (
            <article className="post-card" key={post.title}>
              <div className="post-meta">
                <span>{post.category}</span>
                <span>
                  <CalendarDays size={15} />
                  {post.date}
                </span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <a href="#channels" aria-label={`${post.title} 관련 채널 보기`}>
                더 보기
                <ArrowRight size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="channels" className="channel-section" aria-labelledby="channels-title">
        <div className="channel-copy">
          <span className="eyebrow">
            <ExternalLink size={16} />
            Connected channels
          </span>
          <h2 id="channels-title">유튜브와 SNS로 확장되는 Worker 소식</h2>
          <p>
            현재는 Worker Live AI 유튜브 채널을 우선 연결하고, 추후 X, LinkedIn,
            Instagram 등 SNS 채널을 순차적으로 추가할 수 있도록 링크 구조를 열어두었습니다.
          </p>
        </div>
        <div className="channel-links">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                className={link.active ? "channel-link" : "channel-link is-disabled"}
                href={link.href}
                key={link.label}
                aria-disabled={!link.active}
              >
                <Icon size={20} />
                <span>{link.label}</span>
                {link.active ? <ExternalLink size={17} /> : <span>준비중</span>}
              </a>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <img
          src={`${ASSET_HOST}/footer/dreamlabs/dreamlabs-logo-default.png`}
          alt="DreamLabs"
          width="132"
        />
        <div>
          <strong>worker.dreamlabs.co.kr</strong>
          <span>GitHub Pages 기반 정적 사이트 · CI/CD 자동 배포 구성</span>
        </div>
        <a href="mailto:contact@dreamlabs.co.kr">
          <Mail size={17} />
          contact
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
