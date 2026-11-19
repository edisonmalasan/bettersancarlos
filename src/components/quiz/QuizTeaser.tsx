'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { containerClass, sectionClass } from '@/components/layout/Container';
import quizData from '@/data/quiz.json';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
}

const questions = quizData.questions as QuizQuestion[];
const teaser = questions[0];

const containerCls = `${containerClass} max-[767px]:px-4 max-[480px]:px-2`;

const optionBaseCls =
  'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-[0.9375rem] leading-[1.4] transition-[background-color,border-color,opacity] duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default';

export default function QuizTeaser() {
  const { t } = useLanguage();
  const [chosen, setChosen] = useState<number | null>(null);
  const answered = chosen !== null;
  const isCorrect = chosen === teaser.answer;

  return (
    <section className={cn('bg-primary-deep text-white', sectionClass)}>
      <div className={containerCls}>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <header className="text-center lg:text-left">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[0.75rem] font-semibold tracking-wide text-white">
              <i className="bi bi-patch-question-fill" aria-hidden="true"></i>
              {t('quiz-teaser-eyebrow')}
            </span>
            <h2 className="m-0 mb-3 text-balance text-2xl font-bold leading-[1.25] text-white max-[767px]:text-[1.5rem]">
              {t('quiz-teaser-title')}
            </h2>
            <p className="mx-auto m-0 mb-6 max-w-[440px] text-pretty text-[0.9375rem] leading-[1.6] text-white/85 lg:mx-0">
              {t('quiz-teaser-desc')}
            </p>
            <Link
              href="/quiz"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-[0.9375rem] font-semibold text-primary-deep transition-colors duration-200 hover:bg-bg-alt motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t('quiz-teaser-cta')}
              <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </Link>
            <p className="m-0 mt-4 text-[0.8125rem] text-white/70">
              {questions.length} {t('quiz-teaser-questions')} ·{' '}
              {t('quiz-teaser-no-timer')}
            </p>
          </header>

          <article className="@container rounded-xl border border-line bg-white p-6 text-foreground max-[480px]:p-5">
            <p className="m-0 text-[1.0625rem] font-semibold leading-[1.4] text-balance">
              {teaser.question}
            </p>
            <div className="mt-5 grid gap-2.5 @md:grid-cols-2">
              {teaser.options.map((opt, oi) => {
                const isAnswer = oi === teaser.answer;
                const isChosen = chosen === oi;
                const stateCls = answered
                  ? isAnswer
                    ? 'border-success bg-success/10 text-foreground'
                    : isChosen
                     ? 'border-danger bg-danger/10 text-foreground'
                     : 'border-line bg-white opacity-60'
                  : 'border-line bg-white hover:border-primary hover:bg-primary/5';
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={answered}
                    onClick={() => setChosen(oi)}
                    className={cn(optionBaseCls, stateCls)}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[0.75rem] font-bold text-muted-foreground"
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="min-w-0 flex-1">{opt}</span>
                    {answered && isAnswer ? (
                      <i
                        className="bi bi-check-circle-fill text-success"
                        aria-hidden="true"
                      ></i>
                    ) : null}
                    {answered && isChosen && !isAnswer ? (
                      <i
                        className="bi bi-x-circle-fill text-danger"
                        aria-hidden="true"
                      ></i>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" aria-atomic="true">
              {answered ? (
                <div className="mt-5 rounded-lg border border-line bg-muted p-4">
                  <p
                    className={cn(
                      'm-0 mb-1.5 flex items-center gap-1.5 text-[0.9375rem] font-semibold',
                      isCorrect ? 'text-success' : 'text-danger'
                    )}
                  >
                    <i
                      className={
                        isCorrect
                          ? 'bi bi-check-circle-fill'
                          : 'bi bi-x-circle-fill'
                      }
                      aria-hidden="true"
                    ></i>
                    {isCorrect
                      ? t('quiz-teaser-correct')
                      : t('quiz-teaser-incorrect')}
                  </p>
                  <p className="m-0 text-pretty text-[0.8125rem] leading-[1.55] text-muted-foreground">
                    {teaser.explanation}
                  </p>
                  <Link
                    href="/quiz"
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[0.8125rem] font-semibold text-primary no-underline transition-colors duration-200 hover:text-primary-dark hover:underline motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {t('quiz-teaser-cta')}
                    <i className="bi bi-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              ) : (
                <p className="m-0 mt-5 text-[0.8125rem] text-muted-foreground">
                  {t('quiz-teaser-hint')}
                </p>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
