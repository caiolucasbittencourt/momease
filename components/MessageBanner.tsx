type MessageBannerProps = {
  error?: string | string[];
  notice?: string | string[];
};

function firstMessage(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function MessageBanner({ error, notice }: MessageBannerProps) {
  const errorMessage = firstMessage(error);
  const noticeMessage = firstMessage(notice);

  if (!errorMessage && !noticeMessage) {
    return null;
  }

  if (errorMessage) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
      {noticeMessage}
    </div>
  );
}
