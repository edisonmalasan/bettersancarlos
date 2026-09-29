import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PageHeader from '@/components/layout/PageHeader';
import { sectionClass } from '@/components/layout/Container';

const HistoryQuiz = dynamic(() => import('@/components/quiz/HistoryQuiz'));

export const metadata: Metadata = {
  title: 'History Quiz',
  description: 'Test your knowledge of San Carlos City history — from Binalatongan to the Minor Basilica.',
};

export default function QuizPage() {
  return (
    <>
      <PageHeader
        title="San Carlos City History Quiz"
        description="How well do you know the Heart of Pangasinan? Test your knowledge of the city's history and heritage."
        badge={{ icon: 'bi bi-patch-question-fill', label: 'Quiz' }}
        breadcrumbs={[
          { label: 'nav-home', href: '/' },
          { label: 'Quiz' },
        ]}
      />
      <section className={sectionClass}>
        <HistoryQuiz />
      </section>
    </>
  );
}
