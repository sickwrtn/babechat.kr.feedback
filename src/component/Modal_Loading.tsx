import { Modal, Spinner } from "react-bootstrap"

/**
 * Modal 로딩중
 */
export function Loading() {
    return (<>
        <Modal.Body className='modal-loading'>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Modal.Body>
    </>)
}