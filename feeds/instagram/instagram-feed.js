/*!

    Radancy Component Library: Instagram Feed

    Contributor(s):
    Bobby KC
    Michael "Spell" Spellacy

*/

(function () {

    "use strict";

    const feedContainers = document.querySelectorAll(".radancy-instagram-feed");
    const errorStyle = "background: #ff0000; color: #fff";

    if (!feedContainers.length) {

        console.error("%cInstagram Feed: Please add at least one element with a class of \"radancy-instagram-feed\" to display your feed.", errorStyle);
        return;

    }

    const scriptURL = getInstaScriptURL();

    if (!scriptURL) {

        console.error("%cInstagram Feed: Could not locate script with required parameters.", errorStyle);
        return;

    }

    const params = new URL(scriptURL).searchParams;
    const user = params.get("user");
    const count = params.get("count") || "";
    const caption = params.get("caption") || "";
    const img = params.get("img") || "";
    const useDefaultCSS = params.get("default-css") === "y";
    const useLocalCSS = params.get("local-css") === "y";

    if (!user) {

        console.error("%cInstagram Feed: User not defined, please configure.", errorStyle);
        return;

    }

    // Load default or local CSS if specified.

    if (useDefaultCSS) {

        addStylesheet("https://services.tmpwebeng.com/tmp-share/widget/css/instagram-feed.css");

    }

    if (useLocalCSS) {

        addStylesheet("css/instagram-feed.css");

    }

    // Expose callback in a namespaced object to reduce global pollution.

    window.RadancyInstagram = {

        instaFeedCB: function (feedData) {

            feedContainers.forEach((feedContainer) => {

                feedContainer.innerHTML = feedData.html;

            });

        },

    };

    fetchInstagramFeed();

    function fetchInstagramFeed() {

        const instaFeedURL = `https://services.tmpwebeng.com/tmp-share/widget/instagram.aspx?username=${user}&count=${count}&caption=${caption}&img=${img}&callback=RadancyInstagram.instaFeedCB`;
        const script = document.createElement("script");

        script.src = instaFeedURL;
        script.async = true;

        script.onerror = () => {

            console.error("%cInstagram Feed: Failed to load feed script.", errorStyle);

        };

        document.body.appendChild(script);

        document.dispatchEvent(new CustomEvent("InstagramLoaded"));

        // Optional timeout fallback.

        setTimeout(() => {

            if (!window.RadancyInstagram?.instaFeedCB) {

                console.error("%cInstagram Feed: Sorry, no feed content is available. Please reach out to Radancy support if issue persists.", errorStyle);

            }

        }, 5000);

    }

    function addStylesheet(href) {

        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);

    }

    function getInstaScriptURL() {

        const scripts = document.querySelectorAll("script");

        // Get matched

        let instaScript = [...scripts].filter(function (script) {

            return script.src.includes("instagram-feed.js?user");

        })

        if (instaScript.length) {

            return instaScript[0].src;

        }

        return "";

    }

})();
  