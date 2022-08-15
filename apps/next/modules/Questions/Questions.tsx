import { ReactElement, useState } from 'react';
import { Loader } from '../../components/Loader/Loader';
import { trpc } from '../../utils/trpc';
import { QuestionsItem } from './QuestionsItem/QuestionsItem';

type Props = {
  roomId: string;
  showAnswered?: boolean;
};

const take = 10;

export const Questions = ({ roomId, showAnswered }: Props): ReactElement => {
  const [cursor] = useState<string>();

  const query = trpc.useQuery([
    'question.list',
    { cursor, take, roomId, answered: showAnswered },
  ]);

  if (query.status === 'loading' || query.status === 'idle') {
    return <Loader />;
  }

  if (query.status === 'error') {
    return <span>{query.error.message}</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      {query.data.map((question) => (
        <QuestionsItem
          key={question.id}
          question={question}
          cursor={cursor}
          take={take}
        />
      ))}
    </div>
  );
};
