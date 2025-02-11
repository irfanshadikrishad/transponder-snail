function linkify(text) {
  const urlPattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|]|www\.[a-z0-9.-]+\.[a-z]{2,4}\/?[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  return text.replace(urlPattern, function (url) {
    let href = url;
    if (url.startsWith("www.")) {
      href = "http://" + url;
    }
    return `<a href="${href}" target="_blank">${url}</a>`;
  });
}

export { linkify };
