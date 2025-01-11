import {crls} from "$lib/fluti/services/crls/crls";


crls("public.posts", (validator) => {

    validator.all();
    validator.update()
        .permission("post.owner")
        .query((user, query) => {
            query.eq("author", user.email)
        })

    validator.select()
        .permission("post.owner")

})

crls("public.users", (validator) => {

    validator.select("roles, user");
    validator.select("*").permission("admin");
    validator.select("roles, user, permissions").permission("moderator");
    validator.select("name, permissions").permission("user")

    validator.insert().user(e => e.email === "jacekwoln@gmail.com");
})
