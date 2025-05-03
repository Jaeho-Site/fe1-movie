// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 모달 관련 이벤트 설정
    movieUI.setModalEvents();
    
    // 인기 영화 데이터 로드
    movieAPI.fetchMovies(movieAPI.API_URL)
        .then(movies => {
            movieUI.addMovies(movies);
        });
    
    // 검색 버튼 이벤트 리스너
    movieUI.searchButton.addEventListener('click', () => {
        const searchTerm = movieUI.searchInput.value.trim();
        if (searchTerm) {
            movieAPI.fetchMovies(movieAPI.SEARCH_URL + searchTerm)
                .then(movies => {
                    movieUI.addMovies(movies);
                });
        } else {
            alert('검색어를 입력해주세요.');
        }
    });
    
    // 엔터 키로 검색 실행
    movieUI.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = movieUI.searchInput.value.trim();
            if (searchTerm) {
                movieAPI.fetchMovies(movieAPI.SEARCH_URL + searchTerm)
                    .then(movies => {
                        movieUI.addMovies(movies);
                    });
            } else {
                alert('검색어를 입력해주세요.');
            }
        }
    });
}); 