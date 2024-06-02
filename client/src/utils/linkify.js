function linkify(text) {
  // Regular expression to match URLs
  const urlPattern =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|www\.[a-z0-9.-]+\.[a-z]{2,4}\/?[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  // Function to replace URLs with anchor tags
  return text.replace(urlPattern, function (url) {
    // Add http if the URL starts with www.
    let href = url;
    if (url.startsWith("www.")) {
      href = "http://" + url;
    }
    return `<a href="${href}" target="_blank">${url}</a>`;
  });
}

export { linkify };
