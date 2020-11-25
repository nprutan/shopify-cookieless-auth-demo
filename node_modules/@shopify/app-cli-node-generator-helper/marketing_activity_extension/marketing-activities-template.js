const marketingActivitiesTemplate = `import Router from "koa-router";

const handleResume = async ctx => {
  ctx.body = {};
  ctx.status = 202; // Accepted
};
const handlePause = async ctx => {
  ctx.body = {};
  ctx.status = 202; // Accepted
};
const handleDelete = async ctx => {
  ctx.body = {};
  ctx.status = 202; // Accepted
};
const handleRepublish = async ctx => {
  ctx.body = {};
  ctx.status = 202; // Accepted
};
const handlePreloadFormData = async ctx => {
  ctx.body = {};
};
const handlePreview = async ctx => {
  const placeholderImg = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_small.png"
  const previewResponse = {
    "desktop": {
      "preview_url": placeholderImg,
      "content_type": "text/html",
      "width": 360,
      "height": 200
    },
    "mobile": {
      "preview_url": placeholderImg,
      "content_type": "text/html",
      "width": 360,
      "height": 200
    }
  }
  ctx.body = previewResponse;
};
const handleErrors = async ctx => {
  const query = ctx.query;
  const requestId = query["request_id"]
  const message = query["message"]

  console.error(\`[Marketing Activity App Error Feedback] Request id: \${requestId}, message: \${message}\`)

  ctx.body = {};
};

const marketingActivitiesRouter = new Router();
marketingActivitiesRouter.prefix("/marketing_activities")
marketingActivitiesRouter.patch("/resume", handleResume);
marketingActivitiesRouter.patch("/pause", handlePause);
marketingActivitiesRouter.patch("/delete", handleDelete);
marketingActivitiesRouter.post("/republish", handleRepublish);
marketingActivitiesRouter.post("/preload_form_data", handlePreloadFormData);
marketingActivitiesRouter.post("/preview", handlePreview);
marketingActivitiesRouter.post("/errors", handleErrors);

export default marketingActivitiesRouter;`;

module.exports = marketingActivitiesTemplate;
