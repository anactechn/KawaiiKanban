const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // Estados
        const tarefas = ref([
            { id: 1, titulo: 'Design do site', descricao: 'Criar layout kawaii', status: 'feito', prioridade: 'alta', data: new Date() },
            { id: 2, titulo: 'Implementar Vue.js', descricao: 'Criar componentes', status: 'fazendo', prioridade: 'alta', data: new Date() },
            { id: 3, titulo: 'Testar responsividade', descricao: 'Verificar em mobile', status: 'porFazer', prioridade: 'media', data: new Date(Date.now() + 86400000) },
            { id: 4, titulo: 'Adicionar filtros', descricao: 'Prioridade e status', status: 'feito', prioridade: 'baixa', data: new Date(Date.now() - 86400000) },
            { id: 5, titulo: 'Comprar materiais', descricao: 'Canetas e post-its fofos', status: 'porFazer', prioridade: 'baixa', data: new Date(Date.now() + 86400000 * 3) }
        ]);
        
        const novaTarefaPorFazer = ref('');
        const novaTarefaFazendo = ref('');
        const novaTarefaFeito = ref('');
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todas');
        const filtroData = ref('todas');
        const proximoId = ref(6);
        const tarefaArrastadaId = ref(null);
        
        // Métodos
        const adicionarTarefa = (status) => {
            let titulo = '';
            if (status === 'porFazer') titulo = novaTarefaPorFazer.value;
            if (status === 'fazendo') titulo = novaTarefaFazendo.value;
            if (status === 'feito') titulo = novaTarefaFeito.value;
            
            if (titulo.trim()) {
                tarefas.value.push({
                    id: proximoId.value++,
                    titulo: titulo.trim(),
                    descricao: '',
                    status: status,
                    prioridade: 'media',
                    data: new Date()
                });
                
                if (status === 'porFazer') novaTarefaPorFazer.value = '';
                if (status === 'fazendo') novaTarefaFazendo.value = '';
                if (status === 'feito') novaTarefaFeito.value = '';
            }
        };
        
        const mudarStatus = (id, novoStatus) => {
            const indiceTarefa = tarefas.value.findIndex(tarefa => tarefa.id === id);
            if (indiceTarefa !== -1) {
                tarefas.value[indiceTarefa].status = novoStatus;
            }
        };
        
        const obterRotuloPrioridade = (prioridade) => {
            const rotulos = {
                alta: 'Alta Prioridade',
                media: 'Média Prioridade',
                baixa: 'Baixa Prioridade'
            };
            return rotulos[prioridade];
        };
        
        const formatarData = (data) => {
            return data.toLocaleDateString('pt-BR');
        };
        
        const limparFiltros = () => {
            filtroStatus.value = 'todos';
            filtroPrioridade.value = 'todas';
            filtroData.value = 'todas';
        };
        
        const iniciarArrastar = (evento, tarefaId) => {
            tarefaArrastadaId.value = tarefaId;
        };
        
        // Computed e funções de filtro
        const tarefasFiltradas = (status) => {
            return tarefas.value.filter(tarefa => {
                // Filtro de status
                if (tarefa.status !== status) return false;
                
                // Filtro de prioridade
                if (filtroPrioridade.value !== 'todas' && tarefa.prioridade !== filtroPrioridade.value) {
                    return false;
                }
                
                // Filtro de data
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                
                const dataTarefa = new Date(tarefa.data);
                dataTarefa.setHours(0, 0, 0, 0);
                
                if (filtroData.value === 'hoje' && dataTarefa.getTime() !== hoje.getTime()) {
                    return false;
                }
                
                if (filtroData.value === 'semana') {
                    const inicioSemana = new Date(hoje);
                    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
                    
                    const fimSemana = new Date(inicioSemana);
                    fimSemana.setDate(inicioSemana.getDate() + 6);
                    
                    if (dataTarefa < inicioSemana || dataTarefa > fimSemana) {
                        return false;
                    }
                }
                
                if (filtroData.value === 'mes' && 
                    (dataTarefa.getMonth() !== hoje.getMonth() || 
                     dataTarefa.getFullYear() !== hoje.getFullYear())) {
                    return false;
                }
                
                return true;
            });
        };
        
        return {
            tarefas,
            novaTarefaPorFazer,
            novaTarefaFazendo,
            novaTarefaFeito,
            filtroStatus,
            filtroPrioridade,
            filtroData,
            adicionarTarefa,
            mudarStatus,
            obterRotuloPrioridade,
            formatarData,
            limparFiltros,
            tarefasFiltradas,
            iniciarArrastar,
            tarefaArrastadaId
        };
    }
}).mount('#app');