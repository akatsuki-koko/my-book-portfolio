console.log(`script.jsが読み込まれました`);

document.getElementById(`review-form`).addEventListener(`submit`,async function(e) {
    e.preventDefault();

    const title = document.getElementById(`book-title`).value;
    const author = document.getElementById(`author`).value;
    const content = document.getElementById(`review`).value;
    const stars = Number(document.querySelector(`input[name="stars"]:checked`)?.value) || 0;
    const category = document.getElementById(`category`).value;

    if (!category) return alert(`分類を選択してください`);

    const postRes = await fetch(`/reviews`, {
        method: `POST`,
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ bookTitle: title, author, reviewText: content, stars,category})
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
        <strong>${r.bookTitle}</strong>(${r.author}著)
        <p>分類：${r.category}</p>
        <p>${r.reviewText}</p>
        <small>評価：${r.stars} ☆ / ${new Date(r.createdAt).toLocaleString()}</small>
        <hr>`;
        reviewsDiv.appendChild(item);
    });
}

window.addEventListener(`DOMContentLoaded`, loadReviews);