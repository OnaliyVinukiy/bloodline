import React from "react";
import { Modal, Button } from "flowbite-react";

interface ValidationModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  content: string;
  icon?: React.ReactNode;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  show,
  onClose,
  title,
  content,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header className="flex items-center gap-2 ">
        <p className="flex items-center gap-2 text-xl text-red-600">
          <svg
            className="w-6 h-6 text-red-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          {title}
        </p>
      </Modal.Header>
      <Modal.Body>
        <p className="text-lg text-gray-700">{content}</p>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="failure" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
