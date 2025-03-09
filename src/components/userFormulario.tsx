import { useState } from 'react';
import { Usuario } from '../types/interfaces'

interface UserFormProps {
    showModal: boolean;
    onClose: () => void;
    setUsuario: (usuario: Usuario) => void;
}

export default function UserFormulario({ showModal, onClose, setUsuario }: UserFormProps) {
    // Estados para armazenar os valores dos inputs
    const [nome, setNome] = useState('');
    const [cidade, setCidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [errors, setErrors] = useState<{ nome?: string; cidade?: string; telefone?: string }>({});

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito

        if (value.length > 11) value = value.slice(0, 11);

        // Adiciona a máscara de telefone: (00) 90000-0000
        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }

        setTelefone(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validação dos campos
        const newErrors: { nome?: string; cidade?: string; telefone?: string } = {};
        if (!nome) newErrors.nome = "Nome é obrigatório.";
        if (!cidade) newErrors.cidade = "Cidade é obrigatória.";
        if (!telefone) newErrors.telefone = "Telefone é obrigatório.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert("Todos os campos são obrigatórios!")
            return;
        }

        // Se não houver erros, salva o usuário e fecha o modal
        setUsuario({ nome_usuario: nome, cidade_usuario: cidade, telefone_usuario: telefone });
        onClose();
    };

    if (!showModal) return null;

    return (
        <div className="flex items-center justify-center">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
                    <h2 className="text-xl font-bold mb-4">Formulário do Usuário</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Campo Nome */}
                        <div>
                            <label className="block text-gray-700">Nome:</label>
                            <input
                                type="text"
                                value={nome}
                                required
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                        {/* Campo Cidade */}
                        <div>
                            <label className="block text-gray-700">Cidade:</label>
                            <input
                                type="text"
                                value={cidade}
                                required
                                onChange={(e) => setCidade(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                        {/* Campo Telefone */}
                        <div>
                            <label className="block text-gray-700">Telefone:</label>
                            <input
                                type="tel"
                                value={telefone}
                                required
                                onChange={handleTelefoneChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex justify-between mt-4 space-x-2 w-full">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}