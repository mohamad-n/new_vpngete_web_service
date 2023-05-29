export default async function delay(time: number) {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      return resolve();
    }, time);
  });
}
