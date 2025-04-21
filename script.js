document.getElementById(`review-form`).addEventListener(`submit`,function(e) {
    e.preventDefault();

    const title = document.getElementById(`book-title`).value;
    const content = document.getElementById(`review`).value;
    const reviewsDiv = document.getElementById(`reviews`);
    const reviewItem = document.createElement(`div`);
    reviewItem.innerHTML =`<strong>${title}</strong><p>${content}</p>`;
    reviewsDiv.appendChild(reviewItem);

    e.target.reset();
});