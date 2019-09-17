const routes = [];
const routesApp = require.context('@/app', true, /Router\.js$/);

routesApp
  .keys()
  .forEach((file) => {
    const contentOfFile = routesApp(file).default;

    if (Array.isArray(contentOfFile)) {
      return contentOfFile.forEach((content) => {
        routes.push(content);
      });
    }

    return routes.push(contentOfFile);
  });

export default routes;
