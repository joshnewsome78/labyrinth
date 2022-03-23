import React, { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface StartModalProps {
    show: boolean;
    closeHandler(): void;
}

const StartModal: FC<StartModalProps> = ({ show, closeHandler, children }) => {

    return (
        <Modal show={show} onHide={closeHandler} backdrop="static">
            <Modal.Header>
                <Modal.Title>How to Play</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                If your device supports it, tilt your device to roll your ball through the maze. Otherwise use your finger to the tilt the table.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={closeHandler}>
                    Start
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StartModal;