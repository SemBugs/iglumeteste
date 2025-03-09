import React from "react";

interface props {
    onClose: () => void;
}

const MsgSucesso = ({ onClose }: props) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-lg font-semibold mb-4">Os dados foram enviados com sucesso!</h2>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default MsgSucesso;
