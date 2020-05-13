import React from 'react';
import Modal from "react-bootstrap/Modal";

const GeneralPopup = props => {
    return (
        <div className="GeneralPopup">
            <Modal show={props.show} size='sm' centered backdrop='static' keyboard={false} animation={true}>
                <Modal.Body>
                    <p className='text-center m-0 p-0'>{props.message}</p>
                </Modal.Body>
            </Modal>
        </div >
    );
}

export default GeneralPopup;

