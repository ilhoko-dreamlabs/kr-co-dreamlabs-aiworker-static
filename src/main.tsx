import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  ExternalLink,
  Github,
  Mail,
  Maximize2,
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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

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

const useCases = [
  {
    title: "협업 채널에서 바로 묻고 정리하기",
    category: "Mattermost",
    image: "/use-cases/mattermost-worker-collaboration.png",
    alt: "Mattermost 채널에서 worker0가 질문에 답변하고 후속 일정을 정리하는 화면",
    text:
      "업무 채널 안에서 Worker를 호출해 확인 절차, 참고 링크, 일정 등록까지 이어지는 실무 대화를 남깁니다."
  },
  {
    title: "작업 세션과 지식을 한 화면에서 추적",
    category: "Worker Console",
    image: "/use-cases/local-worker-knowledge-wiki.png",
    alt: "DreamLabs Worker 콘솔에서 작업 결과와 Runtime Knowledge Wiki 그래프를 함께 보는 화면",
    text:
      "로컬 Worker 세션, 작업 결과, Runtime Knowledge Wiki를 함께 보며 진행률과 근거 자료를 점검합니다."
  },
  {
    title: "메신저에서도 자연스러운 업무 응답",
    category: "Messenger",
    image: "/use-cases/messenger-worker-response.png",
    alt: "메신저 대화에서 Worker가 사용자의 호출 표현을 이해하고 응답하는 화면",
    text:
      "일상적인 대화 흐름 안에서도 Worker를 호출해 요청 의도를 파악하고 필요한 답변을 이어갑니다."
  }
];

const videoCases = [
  {
    title: "웹 챗봇에서 Worker에게 바로 요청",
    category: "Web Chat",
    id: "1Uu0611qQmc2_ArtxEn-mt2s_rGxukYfZ",
    poster: "/use-cases/messenger-worker-response.png",
    text:
      "랜딩페이지 진입 후 바로 Worker에게 질문하고 Remote Request API 응답을 확인하는 흐름입니다."
  },
  {
    title: "협업 채널에서 요청 처리",
    category: "Mattermost",
    id: "16HIEalhKoiUlje4XF-jpNMELn_4aGL-D",
    poster: "/use-cases/mattermost-worker-collaboration.png",
    text:
      "업무 채널 안에서 Worker를 호출하고, 실행 결과가 대화 맥락에 남는 실제 사용 장면입니다."
  },
  {
    title: "Worker Console로 실행 상태 확인",
    category: "Console",
    id: "1XShtrAT1UboWkaSah7IFGf7cKqJsMV3Q",
    poster: "/use-cases/local-worker-knowledge-wiki.png",
    text:
      "로컬 작업 세션과 실행 상태를 확인하며 결과물을 검증하는 운영자 관점의 화면입니다."
  },
  {
    title: "Runtime Knowledge 기반 업무 맥락 활용",
    category: "Knowledge",
    id: "1QOTwabqGwfk2QnZg0j6AAIX6yXYYQAX6",
    poster: "/use-cases/local-worker-knowledge-wiki.png",
    text:
      "Worker가 세션 맥락과 지식 기준을 참고해 요청을 이어가는 실제 업무 기록 흐름입니다."
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

const starterPrompts = ["Worker로 무엇을 할 수 있나요?", "정적 사이트 배포를 도와줘", "업무 자동화 사례가 궁금해요"];

function getDrivePreviewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

function getDriveViewUrl(id: string) {
  return `https://drive.google.com/file/d/${id}/view`;
}

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function extractReply(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.reply,
    record.resultSummary,
    record.output,
    record.text,
    record.content,
    record.message,
    record.result,
    record.response,
    record.data
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate === "object") {
      const nested = extractReply(candidate);

      if (nested) {
        return nested;
      }
    }
  }

  return "";
}

function getResultUrl(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const value = (payload as Record<string, unknown>).resultUrl;
  return typeof value === "string" ? value : "";
}

async function pollChatResult(resultUrl: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt < 3 ? 1200 : 2500));

    const response = await fetch(`/api/chat-result?resultUrl=${encodeURIComponent(resultUrl)}`);
    const payload = await response.json();

    if (response.status === 202) {
      continue;
    }

    if (!response.ok) {
      throw new Error("result_poll_failed");
    }

    return payload;
  }

  return null;
}

type ChatPanelProps = {
  idPrefix: string;
  title: string;
  subtitle: string;
  className?: string;
  onClose?: () => void;
  starterPrompts?: string[];
};

function ChatPanel({
  idPrefix,
  title,
  subtitle,
  className,
  onClose,
  starterPrompts: promptSuggestions = []
}: ChatPanelProps) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "안녕하세요. DreamLabs Worker에게 궁금한 내용을 물어보세요."
    }
  ]);
  const [isSending, setIsSending] = React.useState(false);

  function selectStarterPrompt(prompt: string) {
    setInput(prompt);
  }

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = input.trim();

    if (!prompt || isSending) {
      return;
    }

    const idempotencyKey = createIdempotencyKey();

    setInput("");
    setIsSending(true);
    setMessages((current) => [
      ...current,
      { id: `user-${idempotencyKey}`, role: "user", text: prompt }
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, waitSeconds: 30, idempotencyKey })
      });
      const payload = await response.json();
      const finalPayload =
        response.status === 202 && getResultUrl(payload)
          ? await pollChatResult(getResultUrl(payload))
          : payload;
      const reply = extractReply(finalPayload);

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${idempotencyKey}`,
          role: "assistant",
          text:
            reply ||
            (response.status === 202
              ? "요청이 접수되었습니다. 결과 조회 방식이 확정되면 이어서 표시할 수 있습니다."
              : "Worker 응답을 표시할 수 없습니다.")
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${idempotencyKey}`,
          role: "assistant",
          text: "현재 Worker 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={`chat-panel ${className || ""}`} aria-label="Worker 채팅">
      <header className="chat-panel-header">
        <div>
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="채팅 닫기">
            ×
          </button>
        ) : null}
      </header>
      <div className="chat-messages" aria-live="polite">
        {messages.map((message) => (
          <p className={`chat-message is-${message.role}`} key={message.id}>
            {message.text}
          </p>
        ))}
        {isSending ? <p className="chat-message is-assistant">Worker가 처리 중입니다.</p> : null}
      </div>
      {promptSuggestions.length ? (
        <div className="starter-prompts" aria-label="추천 질문">
          {promptSuggestions.map((prompt) => (
            <button type="button" key={prompt} onClick={() => selectStarterPrompt(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
      <form className="chat-form" onSubmit={sendMessage}>
        <label htmlFor={`${idPrefix}-chat-input`}>메시지</label>
        <textarea
          id={`${idPrefix}-chat-input`}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="무엇을 도와드릴까요?"
          rows={2}
        />
        <button type="submit" disabled={isSending || !input.trim()}>
          <MessageSquareText size={17} />
          전송
        </button>
      </form>
    </section>
  );
}

function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <aside className="chat-widget" aria-label="DreamLabs Worker 챗봇">
      {isOpen ? (
        <ChatPanel
          idPrefix="worker-floating"
          title="Worker Chat"
          subtitle="worker0 Remote Request API"
          onClose={() => setIsOpen(false)}
        />
      ) : null}
      <button
        className="chat-toggle"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Worker 채팅 열기"
      >
        <Bot size={22} />
        <span>Worker에게 묻기</span>
      </button>
    </aside>
  );
}

function App() {
  const [activeUseCase, setActiveUseCase] = React.useState<(typeof useCases)[number] | null>(null);
  const [activeVideo, setActiveVideo] = React.useState<(typeof videoCases)[number] | null>(null);
  const featuredVideo = videoCases[0];

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
          <a href="#use-cases">활용예시</a>
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

        <div className="hero-chat-area">
          <section className="hero-demo" aria-label="실제 Worker 사용 영상">
            <div className="hero-demo-copy">
              <span>Live capture</span>
              <strong>실제 Worker 사용 장면</strong>
            </div>
            <button
              className="hero-demo-button"
              type="button"
              onClick={() => setActiveVideo(featuredVideo)}
              aria-label={`${featuredVideo.title} 영상 보기`}
            >
              <img src={featuredVideo.poster} alt="" />
              <span>
                <Play size={18} />
                영상 보기
              </span>
            </button>
          </section>
          <div className="worker-identity" aria-label="DreamLabs Worker">
            <img
              src={`${ASSET_HOST}/agents/dreamlabs-worker/icon/dreamlabs-bot-icon.png`}
              alt=""
              width="76"
              height="76"
            />
            <div>
              <strong>DreamLabs Worker Consultation</strong>
              <span>Plan · Build · Verify · Publish</span>
            </div>
          </div>
          <ChatPanel
            idPrefix="worker-hero"
            title="Worker에게 바로 질문하세요"
            subtitle="worker0 Remote Request API"
            className="is-hero-chat"
            starterPrompts={starterPrompts}
          />
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

      <section id="use-cases" className="use-case-section" aria-labelledby="use-cases-title">
        <div className="section-heading">
          <span>Worker Use Cases</span>
          <h2 id="use-cases-title">실제 업무 화면으로 보는 Worker 활용예시</h2>
          <p>
            채널형 협업, 로컬 작업 세션, 메신저 응답까지 Worker가 어디에서 어떻게
            쓰이는지 실제 화면 중심으로 보여줍니다.
          </p>
        </div>
        <div className="use-case-gallery">
          {useCases.map((item) => (
            <article className="use-case-card" key={item.title}>
              <button
                className="use-case-shot"
                type="button"
                onClick={() => setActiveUseCase(item)}
                aria-label={`${item.title} 이미지 크게 보기`}
              >
                <img src={item.image} alt={item.alt} loading="lazy" />
                <span>
                  <Maximize2 size={17} />
                  크게 보기
                </span>
              </button>
              <div className="use-case-copy">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={item.image} target="_blank" rel="noreferrer">
                  원본 이미지 열기
                  <ExternalLink size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="video-case-section" aria-labelledby="video-cases-title">
          <div className="section-heading is-compact">
            <span>Worker Live Captures</span>
            <h2 id="video-cases-title">영상으로 확인하는 실제 사용 흐름</h2>
            <p>
              Google Drive에 모아둔 실제 화면 녹화입니다. 각 항목을 누르면 사이트 안에서
              바로 재생하고, 필요하면 원본 Drive 파일도 열 수 있습니다.
            </p>
          </div>
          <div className="video-case-grid">
            {videoCases.map((item) => (
              <article className="video-case-card" key={item.id}>
                <button
                  className="video-case-preview"
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  aria-label={`${item.title} 영상 재생`}
                >
                  <img src={item.poster} alt="" loading="lazy" />
                  <span>
                    <Play size={18} />
                    재생
                  </span>
                </button>
                <div className="video-case-copy">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a href={getDriveViewUrl(item.id)} target="_blank" rel="noreferrer">
                    Drive 원본 열기
                    <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
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
      <ChatWidget />
      {activeUseCase ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-lightbox-title"
          onClick={() => setActiveUseCase(null)}
        >
          <div className="image-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <span>{activeUseCase.category}</span>
                <strong id="image-lightbox-title">{activeUseCase.title}</strong>
              </div>
              <button type="button" onClick={() => setActiveUseCase(null)} aria-label="이미지 닫기">
                ×
              </button>
            </header>
            <img src={activeUseCase.image} alt={activeUseCase.alt} />
            <a href={activeUseCase.image} target="_blank" rel="noreferrer">
              원본 이미지 열기
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      ) : null}
      {activeVideo ? (
        <div
          className="video-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-lightbox-title"
          onClick={() => setActiveVideo(null)}
        >
          <div className="video-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <span>{activeVideo.category}</span>
                <strong id="video-lightbox-title">{activeVideo.title}</strong>
              </div>
              <button type="button" onClick={() => setActiveVideo(null)} aria-label="영상 닫기">
                ×
              </button>
            </header>
            <iframe
              src={getDrivePreviewUrl(activeVideo.id)}
              title={activeVideo.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
            <a href={getDriveViewUrl(activeVideo.id)} target="_blank" rel="noreferrer">
              Drive 원본 열기
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      ) : null}
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
