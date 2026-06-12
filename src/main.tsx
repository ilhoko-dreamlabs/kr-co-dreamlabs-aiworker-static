import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Layers3,
  ShieldCheck,
  Workflow
} from "lucide-react";
import "./styles.css";

const workItems = [
  {
    title: "SSoT 기준 고정",
    status: "조건부 완료",
    detail: "공개 힌트와 이전 보호 API 조회 결과를 기준으로 작업 범위를 고정했습니다.",
    dependency: "보호 키 재확인"
  },
  {
    title: "정적 프로젝트 생성",
    status: "진행 완료",
    detail: "Vite, TypeScript, React 기반으로 외부 공개용 정적 페이지를 구성했습니다.",
    dependency: "Node.js, npm"
  },
  {
    title: "운영형 설계문서",
    status: "진행 완료",
    detail: "단계별 승인, 의사결정, 종속성, 배포 판단 기준을 문서화했습니다.",
    dependency: "작업계획"
  },
  {
    title: "배포 준비",
    status: "보류",
    detail: "승인된 배포 런북이 확인되기 전까지 실제 운영 배포는 수행하지 않습니다.",
    dependency: "배포 권한, 런북"
  }
];

const principles = [
  "운영자가 현재 상태를 빠르게 파악할 수 있는 밀도",
  "외부 공개에 적합한 보수적 문구와 명확한 책임 경계",
  "정적 호스팅 친화적인 빌드 산출물",
  "SSoT 원문 secret 및 보호 payload 비저장"
];

function App() {
  return (
    <main className="app-shell">
      <header className="topbar" aria-label="DreamLabs AI Worker">
        <div>
          <span className="eyebrow">DreamLabs external</span>
          <h1>AI Worker 운영 상태</h1>
        </div>
        <a className="repo-link" href="#handoff" aria-label="작업 인계 섹션으로 이동">
          <ExternalLink size={18} />
          인계 정보
        </a>
      </header>

      <section className="summary-grid" aria-label="작업 요약">
        <div className="summary-panel primary-panel">
          <div className="panel-heading">
            <ShieldCheck size={22} />
            <span>작업 기준</span>
          </div>
          <h2>SSoT 후보 신호를 보존하고 정적 산출물까지 완성</h2>
          <p>
            이 페이지는 DreamLabs AI Worker 신규 정적 프로젝트의 외부 공개용 첫 화면입니다.
            보호 자격증명은 저장하지 않고, 검증 가능한 작업 상태와 배포 판단만 표시합니다.
          </p>
        </div>

        <div className="metric-band" aria-label="핵심 지표">
          <div>
            <span className="metric-value">4</span>
            <span className="metric-label">작업 트랙</span>
          </div>
          <div>
            <span className="metric-value">0</span>
            <span className="metric-label">저장된 secret</span>
          </div>
          <div>
            <span className="metric-value">1</span>
            <span className="metric-label">배포 보류 조건</span>
          </div>
        </div>
      </section>

      <section className="work-table" aria-labelledby="work-status-title">
        <div className="section-title">
          <Workflow size={20} />
          <h2 id="work-status-title">단계별 상태</h2>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>항목</th>
                <th>상태</th>
                <th>설명</th>
                <th>종속성</th>
              </tr>
            </thead>
            <tbody>
              {workItems.map((item) => (
                <tr key={item.title}>
                  <td>{item.title}</td>
                  <td>
                    <span className="status-pill">{item.status}</span>
                  </td>
                  <td>{item.detail}</td>
                  <td>{item.dependency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="split-section" aria-label="운영 원칙과 진행 흐름">
        <div className="plain-panel">
          <div className="section-title">
            <Layers3 size={20} />
            <h2>설계 원칙</h2>
          </div>
          <ul className="principle-list">
            {principles.map((principle) => (
              <li key={principle}>
                <CheckCircle2 size={18} />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="timeline">
          <div className="section-title">
            <Clock3 size={20} />
            <h2>다음 판단</h2>
          </div>
          <ol>
            <li>빌드 산출물을 검증합니다.</li>
            <li>승인된 배포 런북과 계정을 확인합니다.</li>
            <li>런북이 확인되면 배포 URL을 최종 보고에 반영합니다.</li>
          </ol>
        </div>
      </section>

      <section id="handoff" className="handoff" aria-labelledby="handoff-title">
        <div>
          <div className="section-title">
            <FileText size={20} />
            <h2 id="handoff-title">인계 메모</h2>
          </div>
          <p>
            작업 문서와 구현 파일은 같은 저장소 안에 유지됩니다. 운영 배포는 별도 승인된
            런북이 확인될 때 수행하는 것이 현재 권고안입니다.
          </p>
        </div>
        <a className="cta-link" href="/docs/">
          문서 확인
          <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
