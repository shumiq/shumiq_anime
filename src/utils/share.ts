const share = (title: string, url: string): void => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  /* eslint-disable  @typescript-eslint/no-unsafe-call */
  /* eslint-disable  @typescript-eslint/no-unsafe-member-access */
  if ((navigator as any).share) {
    void (navigator as any).share({
      title: title,
      url: url,
    });
  } else {
    console.log('share is not support.');
  }
};

export default share;
