const template = `<html>
<body style="padding: 0px; margin: 0px;">
<video width="100%" height="100%" controls style="background: black; margin:0px;padding: 0px;">
  <source src="@url@" type="video/mp4">
</video>
</body>
</html>`;

export default (url: string): string => {
  let indexHTML = template;
  indexHTML = indexHTML.replace('@url@', url);
  return indexHTML;
};
