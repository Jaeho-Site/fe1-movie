const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close-btn');

function addModal(movie) {
    modalDetails.innerHTML = `
        <img src="${movie.posterUrl}" class="modal-poster" alt="${movie.title}">
        <div class="modal-details-content">
            <h2 class="modal-title">${movie.title}</h2>
            <p class="modal-info"><strong>개봉일:</strong> ${movie.releaseDate}</p>
            <p class="modal-info"><strong>장르:</strong> ${movie.genres}</p>
            <p class="modal-info"><strong>평점:</strong> ${movie.stars} (${movie.rating.toFixed(1)})</p>
            <p class="modal-info"><strong>출연:</strong> ${movie.cast}</p>
            <p class="modal-info"><strong>런타임:</strong> ${movie.runtime ? movie.runtime + '분' : '정보 없음'}</p>
            <h3>줄거리</h3>
            <p class="modal-overview">${movie.overview || '요약 정보가 없습니다.'}</p>
        </div>
    `;
    openModal();
}

function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (window.location.search.includes('?movie=')) {
        history.back();
    }
}

function setModalEvents() {
    closeBtn.addEventListener('click', closeModal); 
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('popstate', () => {
        if (modal.style.display === 'block') {
            closeModal();
        }
    });
}

const modalUI = {
    addModal,
    openModal,
    closeModal,
    setModalEvents
};
