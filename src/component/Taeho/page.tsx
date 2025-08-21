import { Pagination } from "react-bootstrap";


/**
 * 페이지 네이션
 */
export function _Pagination({ totalPages, currentPage, onPageChange }:{totalPages:number,currentPage:number,onPageChange:(e:any)=>void}) {
        let items = [];
        // 'First' 버튼
        items.push(
            <Pagination.First key="first" onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        );
        // 'Previous' 버튼
        items.push(
            <Pagination.Prev key="prev" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        );

        // 페이지 번호 생성 로직
        // 여기서는 간단하게 모든 페이지를 보여주지만, 실제로는 ... (ellipsis)를 사용하여 일정 범위만 보여주는 것이 일반적입니다.
        const maxPagesToShow = 5; // 한 번에 보여줄 페이지 번호 개수
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            items.push(<Pagination.Ellipsis key="ellipsis-start" />);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => onPageChange(number)}
            >
                {number}
            </Pagination.Item>,
            );
        }

        if (endPage < totalPages) {
            items.push(<Pagination.Ellipsis key="ellipsis-end" />);
        }

        // 'Next' 버튼
        items.push(
            <Pagination.Next key="next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        );
        // 'Last' 버튼
        items.push(
            <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
        );

        return (
            <Pagination className="justify-content-center"> {/* 중앙 정렬을 위해 클래스 추가 */}
            {items}
            </Pagination>
        );
    }