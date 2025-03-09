import React, { useState, useEffect } from "react";
import Router from "next/router";
import {
	FaPlus,
	FaEdit,
	FaTrash,
	FaRegCopy
} from "react-icons/fa";
import FormLaje from "@/components/formLaje";
import { Laje } from "../types/interfaces";
import {
	tipoLajePorTipo,
	capitalize,
	calcularAreaTotalLajes,
	valorToLocalString
} from "../utils/functions";
import styles from "@/styles/calculadoraLajes.module.css"

export default function CalculadoraLajes() {
	const defaultLaje: Laje = {
		nome_laje: "",
		id: 0,
		vaoViga: 0,
		vaoOposto: 0,
		grupo: "",
		carga: 0,
		ench_id: 0,
		ench_modelo: "",
		trel_id: 0,
		trel_modelo: "",
		tipo_laje: "",
		area_aco_adicional_calculado: 0,
		area_aco_adicional_tabela: 0,
		opt_barras1_tabela: "",
		opt_barras1: "",
		opt_barras2: "",
		opt_barras3: "",
		custo_aco_adicional: 0,
		altura_laje: 0,
		condicao_apoio: "AA",
		tipo_vigota: "",
		relacao_tabela_calculado: 0
	};

	// useStates
	const [dataLajes, setDataLajes] = useState<Laje[]>([]);
	const [curID, setID] = useState<number | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [curLaje, setCurLaje] = useState<Laje>(defaultLaje);
	const [isEdit, setIsEdit] = useState(false);
	const [isFirstRender, setIsFirstRender] = useState(true);

	const getNextID = (): number => dataLajes.length === 0 ? 1 : Math.max(...dataLajes.map((laje) => laje.id)) + 1;


	useEffect(() => {
		const lLajes: Laje[] = JSON.parse(sessionStorage.getItem('listaLajes') || '[]');
		setDataLajes(lLajes);
	}, [])

	useEffect(() => {
		if (!isFirstRender) {
			if (dataLajes) {
				sessionStorage.setItem('listaLajes', JSON.stringify(dataLajes));
			}
		} else {
			setIsFirstRender(true)
		}
		if (!isEdit) {
			handleNovaLaje(curLaje)
		}
		console.log(dataLajes)
	}, [dataLajes])

	const handleApagarLaje = (id: number) => {
		setIsEdit(true);
		setDataLajes(dataLajes.filter((laje) => laje.id !== id));
	};

	const handleNovaLaje = (l: Laje) => {
		const newId = getNextID();
		setID(newId);
		setCurLaje({ ...l, id: newId, nome_laje: `LAJE ${newId}` });
		setIsEdit(false);
		setShowModal(true);
	};

	const handleEditarLaje = (id: number) => {
		const l = dataLajes.find((l) => l.id === id);
		if (l) {
			setID(id);
			setCurLaje(l);
			setIsEdit(true);
			setShowModal(true);
		}
	};

	const handleCloseModal = () => { setShowModal(false); };

	const handleSaveLaje = (l: Laje) => {
		if (!isEdit) {
			// Adiciona a laje no array de lajes
			setDataLajes([...dataLajes, l]);

			// Seta a laje atual
			setCurLaje(l);

		} else {
			setDataLajes(dataLajes.map((laje) => (laje.id === curID ? l : laje)));
		}

		handleCloseModal();
	};

	const resumirLajesUnicas = (lajes: Laje[]): JSX.Element[] => {
		if (!lajes.length) {
			return [<p key="nenhuma-laje">Nenhuma laje na lista.</p>];
		}

		// Criar um conjunto para armazenar combinações únicas
		const lajesUnicas = new Set<string>();

		lajes.forEach((laje) => {
			const resumo = `${capitalize(laje.grupo)} - ${tipoLajePorTipo(laje.tipo_laje)} - Sobrecarga: ${laje.carga}kgf`;
			lajesUnicas.add(resumo);
		});

		// Retorna os parágrafos JSX
		return Array.from(lajesUnicas).map((resumo, index) => (
			<p key={index}>{resumo}</p>
		));
	};

	const handleCopyLaje = (id: number) => {
		// Encontra a laje pelo ID
		const lajeParaCopiar = dataLajes.find((laje) => laje.id === id);

		if (lajeParaCopiar) {
			// Gera um novo ID
			const newId = getNextID();

			// Cria uma cópia da laje com novo ID e nome
			const novaLaje = {
				...lajeParaCopiar,
				id: newId,
				nome_laje: `LAJE ${newId}`,
			};

			// Atualiza a lista de lajes com a nova cópia
			setIsEdit(true);
			setDataLajes([...dataLajes, novaLaje]);
		}
	};

	// Tabela
	const tbLajes = () => {
		return (
			<div className={styles.tableContainer}>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>VÃOS</th>
							<th>TIPO</th>
							<th >TRELIÇA</th>
							<th >ENCH.</th>
							<th >SOBRECARGA</th>
							<th >ALTURA</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{dataLajes.map((l, index) => (
							<tr key={index}>
								<td >{l.nome_laje}</td>
								<td>{Number(l.vaoViga).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} x {Number(l.vaoOposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
								<td>{tipoLajePorTipo(l.tipo_laje)}</td>
								<td>{l.trel_modelo}</td>
								<td>{l.ench_modelo}</td>
								<td>{l.carga} kgf</td>
								<td>{l.altura_laje} cm</td>
								<td>
									<button onClick={() => handleApagarLaje(l.id)}>
										<FaTrash size={28} />
									</button>
									<button onClick={() => handleEditarLaje(l.id)}>
										<FaEdit size={30} />
									</button>
									<button onClick={() => handleCopyLaje(l.id)}>
										<FaRegCopy size={30} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div >
		);
	};

	const areaTotal = valorToLocalString(calcularAreaTotalLajes(dataLajes))

	return (
		<div className={styles.mainContainer}>
			<div className={styles.buttonsContainer}>
				<button onClick={() => handleNovaLaje(defaultLaje)}> <FaPlus /> Inserir</button>
				<span>{areaTotal} m²</span>
			</div>

			<h1>Especificações da Laje</h1>
			{resumirLajesUnicas(dataLajes)}

			{tbLajes()}

			<div className={styles.footerContainer} onClick={() => {
				if (dataLajes.length <= 0) return null;
				sessionStorage.setItem('listaLajes', JSON.stringify(dataLajes));
				Router.push('/Report',);
			}}>
				<button>VER CUSTO DA LAJE</button>
			</div>

			<FormLaje
				showModal={showModal}
				setShowModal={setShowModal}
				onClose={handleCloseModal}
				onSave={handleSaveLaje}
				idLaje={curID ?? 0}
				laje={curLaje}
				lajeInicial={defaultLaje}
				novaLaje={handleNovaLaje}
				isEdit={isEdit}
			/>
		</div>
	);
}
