import React from "react";
import { Link } from "react-router-dom";
import "./UserPage.css";
import "./About.css";

const serviceValues = [
  {
    title: "편안한 속도",
    description:
      "빠르게 결론을 내리기보다, 지금 느끼는 감정을 천천히 살펴볼 수 있는 속도를 중요하게 생각합니다.",
  },
  {
    title: "가벼운 시작",
    description:
      "상담이 처음인 사람도 부담 없이 들어올 수 있도록 일기, 예약, 굿즈 탐색 흐름을 단순하게 구성했습니다.",
  },
  {
    title: "부드러운 연결",
    description:
      "감정 기록, 상담 예약, 마음 정리에 도움이 되는 상품을 한 공간에서 자연스럽게 이어 보도록 설계했습니다.",
  },
];

const serviceSteps = [
  {
    title: "감정을 적어 봅니다",
    description: "마음일기에 오늘 있었던 일과 감정을 남기면서 현재 상태를 가볍게 정리합니다.",
  },
  {
    title: "필요한 도움을 고릅니다",
    description: "상담 상품을 비교하고, 지금 나에게 맞는 방식이 무엇인지 천천히 확인합니다.",
  },
  {
    title: "예약과 기록을 이어 봅니다",
    description: "예약 확인과 주문 확인 화면에서 내가 남긴 기록과 선택을 한눈에 볼 수 있습니다.",
  },
];

const faqs = [
  {
    question: "이 프로젝트는 어떤 서비스를 상상하고 만들었나요?",
    answer:
      "감정 기록과 상담 예약, 그리고 마음 돌봄 상품을 하나의 흐름으로 묶은 심리 케어 콘셉트 프로젝트입니다.",
  },
  {
    question: "왜 전체 톤을 차분하게 잡았나요?",
    answer:
      "긴장감을 낮추고 머무르는 시간을 늘리기 위해 낮은 채도의 색과 부드러운 질감을 기본 방향으로 잡았습니다.",
  },
  {
    question: "이번에 무엇을 개선했나요?",
    answer:
      "전체 글자 크기를 키우고, 너무 무겁게 가라앉던 어두운 배경을 조금 더 따뜻하고 열린 인상으로 조정했습니다.",
  },
];

const About = () => {
  return (
    <div className="user-page about-page">
      <section className="user-hero page-surface">
        <div className="hero-copy">
          <span className="page-eyebrow">서비스 소개</span>
          <h1 className="page-title">마음이 조금 덜 무겁게 느껴지는 화면을 목표로 했습니다.</h1>
          <p className="page-description">
            마음상점은 감정을 적고, 상담을 고르고, 필요한 도움을 확인하는 과정을 한곳에서 이어 보게 만든 프로젝트입니다.
            너무 닫힌 어두움보다는, 조용하지만 오래 머물 수 있는 분위기로 다듬었습니다.
          </p>
          <div className="page-actions">
            <Link to="/mind-diary" className="primary-link">
              마음일기 보러가기
            </Link>
            <Link to="/counseling" className="secondary-link">
              상담 상품 보기
            </Link>
          </div>
        </div>

        <div className="summary-list">
          <div className="summary-card">
            <span className="summary-label">서비스 키워드</span>
            <strong className="summary-value">기록 · 상담 · 회복</strong>
            <span className="summary-note">세 기능이 자연스럽게 이어지도록 구성했습니다.</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">이번 개선 방향</span>
            <strong className="summary-value">덜 답답하게</strong>
            <span className="summary-note">따뜻한 톤과 더 큰 글자로 가독성을 높였습니다.</span>
          </div>
        </div>
      </section>

      <section className="user-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">서비스가 지키고 싶은 기준</h2>
            <p className="section-description">기분을 압도하지 않고, 천천히 읽히는 사용자 경험을 기준으로 잡았습니다.</p>
          </div>
        </div>

        <div className="card-grid three">
          {serviceValues.map((value) => (
            <article key={value.title} className="user-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="user-section">
        <div className="about-story-grid">
          <article className="user-card about-story-text">
            <h3>왜 이런 구조로 만들었는지</h3>
            <p>
              상담 서비스는 대개 첫 진입 장벽이 높습니다. 그래서 바로 예약부터 강하게 요구하기보다, 감정을 적고 정보를
              살펴보는 흐름을 먼저 두었습니다.
            </p>
            <p>
              동시에 화면이 지나치게 어둡거나 개인 취향이 강해 보이면 많은 사용자가 거리감을 느낄 수 있어서, 이번에는
              밝기를 조금 열고 문장 크기도 키워 보다 넓은 사용자에게 읽히는 방향으로 조정했습니다.
            </p>
          </article>

          <article className="user-card">
            <h3>이용 흐름</h3>
            <div className="about-step-list">
              {serviceSteps.map((step, index) => (
                <div key={step.title} className="about-step-card">
                  <span className="about-step-number">{index + 1}</span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="user-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">자주 묻는 이야기</h2>
            <p className="section-description">프로젝트 의도와 이번 방향 수정 포인트를 짧게 정리했습니다.</p>
          </div>
        </div>

        <div className="about-faq-list">
          {faqs.map((item) => (
            <article key={item.question} className="user-card about-faq-item">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
