'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import quizData from '@/data/quiz.json';

gsap.registerPlugin(useGSAP);

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    answer: number;
    explanation: string;
    source: string;
}

const questions = (quizData.questions as QuizQuestion[]);

type Phase = 'intro' | 'playing' | 'results';
type Selection = { chosen: number; correct: boolean } | null;

const containerRefCls = 'mx-auto w-full max-w-[640px] px-4 max-[480px]:px-3';
const cardCls = 'rounded-xl border border-line bg-white p-6 max-[480px]:p-5 sm:p-8';
const primaryBtnCls =
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-[0.9375rem] font-semibold text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary-dark hover:shadow-[0_4px_12px_rgba(58, 125, 68,0.3)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

function LetterIcon({ index }: { index: number }) {
    const letters = ['A', 'B', 'C', 'D'];
    return (
        <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[0.75rem] font-bold text-muted-foreground transition-colors duration-200"
        >
            {letters[index]}
        </span>
    );
}

export default function HistoryQuiz() {
    const [phase, setPhase] = useState<Phase>('intro');
    const [index, setIndex] = useState(0);
    const [selection, setSelection] = useState<Selection>(null);
    const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));

    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const resultsListRef = useRef<HTMLUListElement>(null);

    const question = questions[index];
    const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].answer ? 1 : 0), 0);
    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearAdvanceTimer = () => {
        if (advanceTimer.current) {
            clearTimeout(advanceTimer.current);
            advanceTimer.current = null;
        }
    };

    // Question transition: outgoing/incoming handled via dependencies on `index`
    useGSAP(
        () => {
            const panel = panelRef.current;
            if (!panel) return;
            const mm = gsap.matchMedia();
            mm.add(
                { motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' },
                (ctx?: gsap.Context) => {
                    const { reduced } = ctx?.conditions ?? { reduced: false };
                    if (reduced) {
                        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.01 });
                        return;
                    }
                    gsap.fromTo(
                        panel,
                        { opacity: 0, x: 16 },
                        { opacity: 1, x: 0, duration: 0.24, ease: 'power2.out' }
                    );
                }
            );
            return () => mm.revert();
        },
        { scope: rootRef, dependencies: [index, phase], revertOnUpdate: true }
    );

    // Results reveal: stagger 40ms
    useGSAP(
        () => {
            const list = resultsListRef.current;
            if (!list || phase !== 'results') return;
            const mm = gsap.matchMedia();
            mm.add(
                { motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' },
                (ctx?: gsap.Context) => {
                    const { reduced } = ctx?.conditions ?? { reduced: false };
                    const items = list.querySelectorAll('li');
                    if (reduced) {
                        gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.008 });
                        return;
                    }
                    gsap.fromTo(items, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out', stagger: 0.04 });
                }
            );
            return () => mm.revert();
        },
        { scope: rootRef, dependencies: [phase], revertOnUpdate: true }
    );

    // Option press micro-feedback is handled with CSS active:scale (see cls) — no rAF loop needed.

    function handleSelect(optionIndex: number) {
        if (selection) return; // lock after first pick
        const correct = optionIndex === question.answer;
        setSelection({ chosen: optionIndex, correct });
        const next = answers.slice();
        next[index] = optionIndex;
        setAnswers(next);
        clearAdvanceTimer();
        // Immediate visual confirm/deny, then auto-advance (~600ms feel per D3)
        advanceTimer.current = setTimeout(() => {
            advanceTimer.current = null;
            if (index + 1 < questions.length) {
                setIndex(index + 1);
                setSelection(null);
            } else {
                setPhase('results');
                setSelection(null);
            }
        }, 600);
    }

    function handleRestart() {
        clearAdvanceTimer();
        setAnswers(questions.map(() => null));
        setIndex(0);
        setSelection(null);
        setPhase('intro');
    }

    const progressPct = phase === 'results' ? 100 : Math.round((index / questions.length) * 100);

    const resultsMarkup = (
        <>
            <div className="mb-6 text-center">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[rgba(58, 125, 68,0.08)] px-3 py-1 text-[0.75rem] font-semibold text-primary">
                    <i className="bi bi-award-fill"></i> Quiz complete
                </span>
                <p className="m-0 text-[2.5rem] font-bold leading-[1.1] text-primary">{score}/{questions.length}</p>
                <p className="m-0 mt-1 text-[0.9375rem] text-muted-foreground">
                    {score === questions.length
                        ? 'Perfect score — you really know San Carlos history!'
                        : score >= questions.length * 0.7
                            ? 'Great job — solid grasp of city history.'
                            : 'Good start — explore /about to learn more.'}
                </p>
            </div>

            <h3 className="mb-3 text-[0.9375rem] font-semibold text-foreground">Review — correct answers</h3>
            <ul ref={resultsListRef} className="m-0 flex list-none flex-col gap-3 pl-0" role="list">
                {questions.map((q, i) => {
                    const chosen = answers[i];
                    const wasCorrect = chosen === q.answer;
                    return (
                        <li key={q.id} className="rounded-xl border border-line bg-white p-4">
                            <div className="mb-2 flex items-start justify-between gap-2">
                                <span className="text-[0.8125rem] font-semibold leading-[1.4] text-foreground">
                                    {i + 1}. {q.question}
                                </span>
                                <span
                                    className={`shrink-0 rounded-md px-2 py-[3px] text-[0.6875rem] font-semibold ${wasCorrect ? 'bg-success/10 text-foreground' : 'bg-danger/10 text-foreground'}`}
                                >
                                    {wasCorrect ? 'Correct' : 'Missed'}
                                </span>
                            </div>
                            <p className="m-0 mb-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-[1.5] text-foreground">
                                <i className="bi bi-check-circle-fill mt-[2px] text-success"></i>
                                <span>{q.options[q.answer]}</span>
                            </p>
                            {!wasCorrect && chosen !== null ? (
                                <p className="m-0 mb-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-[1.5] text-muted-foreground">
                                    <i className="bi bi-x-circle-fill mt-[2px] text-danger"></i>
                                    <span>You picked: {q.options[chosen]}</span>
                                </p>
                            ) : null}
                            <p className="m-0 mb-1.5 text-[0.8125rem] leading-[1.55] text-muted-foreground">{q.explanation}</p>
                            <p className="m-0 truncate text-[0.6875rem] text-muted-foreground/80" title={q.source}>
                                Source: {q.source}
                            </p>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={handleRestart} className={primaryBtnCls}>
                    <i className="bi bi-arrow-repeat"></i> Play again
                </button>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-6 py-3 text-[0.9375rem] font-semibold text-foreground transition-[border-color,background-color] duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <i className="bi bi-book"></i> Learn more on /about
                </Link>
            </div>
        </>
    );

    return (
        <div ref={rootRef} className={containerRefCls}>
            <div className={cardCls}>
                {phase === 'intro' ? (
                    <div className="py-4 text-center sm:py-8">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-[1.5rem] text-primary">
                            <i className="bi bi-patch-question-fill" aria-hidden="true"></i>
                        </div>
                        <h2 className="m-0 mb-2 text-[1.375rem] font-bold text-foreground">San Carlos City History Quiz</h2>
                        <p className="mx-auto m-0 mb-6 max-w-[440px] text-[0.9375rem] leading-[1.6] text-muted-foreground">
                            {questions.length} multiple-choice questions on the city&apos;s history and heritage — from
                            Binalatongan to the Minor Basilica. Every answer is traced to verified research.
                        </p>
                        <p className="m-0 mb-6 text-[0.8125rem] text-muted-foreground">
                            <i className="bi bi-info-circle mr-1"></i> No timer — read each question at your own pace.
                        </p>
                        <button type="button" onClick={() => setPhase('playing')} className={primaryBtnCls}>
                            Start quiz <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                ) : phase === 'playing' ? (
                    <div ref={panelRef} aria-live="polite">
                        {/* Progress */}
                        <div className="mb-5">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[0.8125rem] font-medium text-muted-foreground">
                                    Question {index + 1} of {questions.length}
                                </span>
                                <span className="text-[0.8125rem] font-medium text-muted-foreground">Score: {score}</span>
                            </div>
                            <div
                                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                                role="progressbar"
                                aria-valuenow={progressPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Quiz progress"
                            >
                                <div
                                    className="h-full rounded-full bg-primary transition-[width] duration-200"
                                    style={{ width: `${progressPct}%` }}
                                ></div>
                            </div>
                        </div>

                        <h3 className="m-0 mb-4 text-[1.0625rem] font-semibold leading-[1.4] text-foreground">{question.question}</h3>

                        <div className="flex flex-col gap-2.5">
                            {question.options.map((opt, oi) => {
                                const isChosen = selection?.chosen === oi;
                                const isAnswer = oi === question.answer;
                                let stateCls = 'border-line bg-white hover:border-primary hover:bg-primary/5';
                                if (selection) {
                                    if (isAnswer) stateCls = 'border-success bg-success/10 text-foreground';
                                    else if (isChosen) stateCls = 'border-danger bg-danger/10 text-foreground';
                                    else stateCls = 'border-line bg-white opacity-60';
                                }
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        disabled={!!selection}
                                        onClick={() => handleSelect(oi)}
                                        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-[0.9375rem] leading-[1.4] text-foreground transition-[background-color,border-color,opacity] duration-200 active:scale-[0.98] disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${stateCls}`}
                                    >
                                        <LetterIcon index={oi} />
                                        <span className="min-w-0 flex-1">{opt}</span>
                                        {selection && isAnswer ? <i className="bi bi-check-circle-fill text-success" aria-hidden="true"></i> : null}
                                        {selection && isChosen && !isAnswer ? <i className="bi bi-x-circle-fill text-danger" aria-hidden="true"></i> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div aria-live="polite">{resultsMarkup}</div>
                )}
            </div>
        </div>
    );
}
