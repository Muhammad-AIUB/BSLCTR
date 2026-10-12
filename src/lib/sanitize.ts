import DOMPurify from "dompurify";

const TEXT_ALIGN = /(?:^|;)\s*text-align\s*:\s*(left|right|center|justify)\s*(?:;|$)/i;

// Its own instance, so the hook below does not change DOMPurify for any other caller.
let purify: typeof DOMPurify | null = null;

/**
 * Makes stored rich text safe to pass to dangerouslySetInnerHTML. Browser only: DOMPurify
 * needs a DOM, and this throws without one, so nothing is ever rendered unsanitised.
 *
 * DOMPurify's defaults stop script but let CSS through, and CSS is enough to do damage: a
 * stored `<style>body{display:none}</style>` blanked the whole Cases page, and a `style`
 * attribute can lay one element over everything else. So `<style>` is dropped, and a `style`
 * attribute keeps only the text alignment the editor wrote. `class` and `id` go as well: the
 * site's own stylesheet has `fixed inset-0 z-50`, which covers the page just as well. Form
 * controls and media players have no place in a case description either.
 */
export function sanitizeRichText(html: string): string {
    if (!purify) {
        purify = DOMPurify(window);
        purify.addHook("uponSanitizeAttribute", (_node, data) => {
            if (data.attrName !== "style") return;
            const align = TEXT_ALIGN.exec(data.attrValue)?.[1];
            if (align) data.attrValue = `text-align: ${align.toLowerCase()}`;
            else data.keepAttr = false;
        });
    }
    return purify.sanitize(html, {
        FORBID_TAGS: [
            "style", "form", "input", "button", "textarea", "select", "option", "dialog",
            "video", "audio",
        ],
        FORBID_ATTR: ["class", "id"],
    });
}
