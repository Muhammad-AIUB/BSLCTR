const YouTubeLive = () => {
    return (
        <div className="w-full aspect-video">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Kcdl98PyWNA?si=_U99YCdQSRzZamu3&autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>

            <iframe
                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FJamunaTelevision%2Fvideos%2F1857262375067653%2F&show_text=false&width=560&t=0"
                width="560"
                height="314"
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
        </div>
    );
};

export default YouTubeLive;
