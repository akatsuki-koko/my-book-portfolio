console.log(`script.jsが読み込まれました`);

document.getElementById(`review-form`).addEventListener(`submit`,async function(e) {
    e.preventDefault();

    const title = document.getElementById(`book-title`).value;
    const content = document.getElementById(`review`).value;
    const stars = Number(document.getElementById(`stars`).value) || 0;

    const postRes = await fetch(`/reviews`, {
        method: `POST`,
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle: title, reviewText: content, stars})
    });
    if (!postRes.ok) {
        alert(`レビューの送信に失敗しました`);
        return;
    }

    await loadReviews();
    e.target.reset();
});

async function loadReviews() {
    const reviewsDiv = document.getElementById(`reviews`);
    reviewsDiv.innerHTML =`<h3>みんなのレビュー</h3>`;

    const res = await fetch(`/reviews`);
    if (!res.ok) {
        console.error(`レビュー取得失敗`, res.status);
        return;
    }
    const reviews = await res.json();

    reviews.forEach(r => {
        const item = document.createElement(`div`);
        item.innerHTML = `
        <strong>${r.bookTitle}</strong>
        <p>${r.reviewText}</p>
        <small>評価：${r.stars} ☆ / ${new Date(r.createdAt).toLocaleString()}</small>
        <hr>`;
        reviewsDiv.appendChild(item);
    });
}

window.addEventListener(`DOMContentLoaded`, loadReviews);