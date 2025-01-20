// @ts-ignore
export default defineBackground(() => {
  // @ts-ignore
  console.log('Hello background!', { id: browser.runtime.id });
});
