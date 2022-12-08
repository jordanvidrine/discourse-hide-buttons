import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", api => {
  api.onPageChange(() => {
    let currentRoute = api.container.lookup("router:main").currentRoute;
    let isCategory = currentRoute.name === "discovery.category";
    let isTag = currentRoute.name === "tag.show";
    let isTopic = currentRoute.name.includes("topic");
    document.body.classList.remove("hide-topic-buttons");
    if (isCategory || isTag || isTopic) {
      if (isCategory) {
        let category_id = currentRoute.attributes.category.id;
        if (
          settings.hide_reply_categories.split("|").includes(`${category_id}`)
        ) {
          document.body.classList.add("hide-topic-buttons");
        }
      } else if (isTag) {
        let { tag_id } = currentRoute.params;
        if (settings.hide_reply_tags.split("|").includes(tag_id)) {
          document.body.classList.add("hide-topic-buttons");
        }
      } else {
        let { category_id, tags } = currentRoute.parent.attributes;
        let includesHideReplyTags = settings.hide_reply_tags
          .split("|")
          .filter(tag_id => {
            return tags.includes(tag_id);
          });
        if (
          includesHideReplyTags.length > 0 ||
          settings.hide_reply_categories.split("|").includes(`${category_id}`)
        ) {
          document.body.classList.add("hide-topic-buttons");
        }
      }
    }
  });
});
