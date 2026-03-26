import { useEffect } from 'react';

interface Props {
  title: string;
  description?: string;
}

export default function PageHead({ title, description }: Props) {
  useEffect(() => {
    document.title = `${title} | FinTrack`;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }
  }, [title, description]);

  return null;
}
