<template>
  <div class="data-table-container">
    <!-- Filtros e Barra de Ações -->
    <div class="data-table-actions">
      <div class="search-filter">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="searchPlaceholder || 'Pesquisar...'" 
            @input="handleSearch"
          />
          <i v-if="searchQuery" class="fas fa-times-circle" @click="clearSearch"></i>
        </div>
      </div>
      
      <div class="action-buttons">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <!-- Tabela -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" @click="sortBy(column)" :class="{ sortable: column.sortable }">
              {{ column.label }}
              <i v-if="column.sortable" :class="getSortIcon(column.key)"></i>
            </th>
            <th v-if="hasActions" class="actions-column">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="loading-cell">
              <div class="spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
                <span>Carregando dados...</span>
              </div>
            </td>
          </tr>
          
          <tr v-else-if="filteredItems.length === 0" class="empty-row">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="empty-cell">
              <div class="empty-state">
                <i class="fas fa-search"></i>
                <span v-if="searchQuery">Nenhum resultado encontrado para "{{ searchQuery }}"</span>
                <span v-else>Nenhum dado encontrado</span>
              </div>
            </td>
          </tr>
          
          <tr v-for="(item, index) in paginatedItems" :key="item.id || index">
            <td v-for="column in columns" :key="column.key">
              <!-- Se o formato for um componente personalizado, use slot scoped -->
              <slot v-if="column.slot" :name="column.slot" :item="item" :value="getItemValue(item, column.key)">
                {{ getItemValue(item, column.key) }}
              </slot>
              <!-- Se for definido um formato para exibição, aplique-o -->
              <template v-else-if="column.format">
                <span v-html="formatValue(getItemValue(item, column.key), column.format, item)"></span>
              </template>
              <!-- Caso padrão, exibe o valor diretamente -->
              <template v-else>
                {{ getItemValue(item, column.key) }}
              </template>
            </td>
            
            <!-- Colunas de ações passadas via slot -->
            <td v-if="hasActions" class="actions-cell">
              <slot name="row-actions" :item="item" :index="index"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Paginação -->
    <div class="table-pagination" v-if="pagination && totalItems > 0">
      <div class="pagination-info">
        Exibindo {{ paginationStart }} - {{ paginationEnd }} de {{ totalItems }} itens
      </div>
      
      <div class="pagination-controls">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1" 
          @click="goToPage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <!-- Primeira página -->
        <button 
          v-if="showFirstPageButton" 
          class="pagination-button" 
          :class="{ active: currentPage === 1 }" 
          @click="goToPage(1)"
        >
          1
        </button>
        
        <!-- Ellipsis para início -->
        <span v-if="showStartEllipsis" class="pagination-ellipsis">...</span>
        
        <!-- Páginas do meio -->
        <button 
          v-for="page in visiblePageNumbers" 
          :key="page" 
          class="pagination-button" 
          :class="{ active: currentPage === page }" 
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <!-- Ellipsis para fim -->
        <span v-if="showEndEllipsis" class="pagination-ellipsis">...</span>
        
        <!-- Última página -->
        <button 
          v-if="showLastPageButton" 
          class="pagination-button" 
          :class="{ active: currentPage === totalPages }" 
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </button>
        
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages" 
          @click="goToPage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="pagination-limit">
        <select v-model="itemsPerPage" @change="onItemsPerPageChange">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }} por página
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    // Configuração da tabela
    columns: {
      type: Array,
      required: true,
      // Espera um array de objetos com formato { key, label, sortable, format, slot }
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    
    // Configuração de pesquisa
    searchEnabled: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    searchFields: {
      type: Array,
      default: () => [] 
      // Se não for fornecido, a pesquisa será feita em todas as colunas
    },
    
    // Configuração de ordenação
    initialSortKey: {
      type: String,
      default: null
    },
    initialSortOrder: {
      type: String,
      default: 'asc',
      validator: (value) => ['asc', 'desc'].includes(value)
    },
    
    // Configuração de paginação
    pagination: {
      type: Boolean,
      default: true
    },
    initialItemsPerPage: {
      type: Number,
      default: 10
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [5, 10, 25, 50, 100]
    },
    
    // Controla se tem ações por linha
    hasActions: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      // Estado interno para pesquisa e ordenação
      searchQuery: '',
      sortKey: this.initialSortKey,
      sortOrder: this.initialSortOrder,
      
      // Paginação
      currentPage: 1,
      itemsPerPage: this.initialItemsPerPage,
      
      // Para pesquisa com debounce
      searchTimeout: null
    };
  },
  
  computed: {
    // Itens filtrados pela pesquisa
    filteredItems() {
      let result = [...this.items];
      
      // Aplicar filtros de pesquisa
      if (this.searchQuery && this.searchEnabled) {
        const query = this.searchQuery.toLowerCase();
        const fields = this.searchFields.length 
          ? this.searchFields 
          : this.columns.map(col => col.key);
        
        result = result.filter(item => {
          return fields.some(field => {
            const value = this.getItemValue(item, field);
            return value && String(value).toLowerCase().includes(query);
          });
        });
      }
      
      // Aplicar ordenação
      if (this.sortKey) {
        result.sort((a, b) => {
          const aValue = this.getItemValue(a, this.sortKey);
          const bValue = this.getItemValue(b, this.sortKey);
          
          // Comparação de valores
          if (aValue === bValue) return 0;
          
          const factor = this.sortOrder === 'asc' ? 1 : -1;
          
          // Comparação para datas (se os valores parecem ser datas)
          if (aValue instanceof Date && bValue instanceof Date) {
            return factor * (aValue.getTime() - bValue.getTime());
          }
          
          // Comparação para números
          if (!isNaN(aValue) && !isNaN(bValue)) {
            return factor * (Number(aValue) - Number(bValue));
          }
          
          // Comparação para strings (padrão)
          return factor * String(aValue).localeCompare(String(bValue));
        });
      }
      
      return result;
    },
    
    // Total de itens após a filtragem
    totalItems() {
      return this.filteredItems.length;
    },
    
    // Cálculo do total de páginas
    totalPages() {
      return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
    },
    
    // Itens na página atual
    paginatedItems() {
      if (!this.pagination) return this.filteredItems;
      
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    
    // Informações de paginação para exibição
    paginationStart() {
      if (this.totalItems === 0) return 0;
      return ((this.currentPage - 1) * this.itemsPerPage) + 1;
    },
    
    paginationEnd() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    },
    
    // Lógica para mostrar páginas na navegação
    visiblePageNumbers() {
      const delta = 2; // Número de páginas visíveis antes e depois da atual
      let range = [];
      
      const startPage = Math.max(2, this.currentPage - delta);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + delta);
      
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
      
      return range;
    },
    
    showFirstPageButton() {
      return this.totalPages > 1;
    },
    
    showLastPageButton() {
      return this.totalPages > 1 && this.totalPages !== 1;
    },
    
    showStartEllipsis() {
      return this.visiblePageNumbers.length > 0 && this.visiblePageNumbers[0] > 2;
    },
    
    showEndEllipsis() {
      return this.visiblePageNumbers.length > 0 && 
             this.visiblePageNumbers[this.visiblePageNumbers.length - 1] < this.totalPages - 1;
    }
  },
  
  watch: {
    items() {
      // Quando os dados mudam, verifica se a página atual ainda é válida
      if (this.currentPage > this.totalPages) {
        this.currentPage = Math.max(1, this.totalPages);
      }
    },
    
    itemsPerPage() {
      // Quando mudar itens por página, voltar para a primeira página
      this.currentPage = 1;
    }
  },
  
  methods: {
    // Acessar o valor de um objeto usando notação de ponto ou colchetes
    getItemValue(item, key) {
      if (!key) return '';
      
      // Suporte para chaves aninhadas como 'user.name'
      return key.split('.').reduce((obj, k) => obj && obj[k] !== undefined ? obj[k] : '', item);
    },
    
    // Formatar valores com base no tipo
    formatValue(value, format, item) {
      if (value === undefined || value === null) return '-';
      
      if (typeof format === 'function') {
        return format(value, item);
      }
      
      switch (format) {
        case 'date':
          return this.formatDate(value);
        case 'datetime':
          return this.formatDateTime(value);
        case 'currency':
          return this.formatCurrency(value);
        case 'number':
          return this.formatNumber(value);
        case 'boolean':
          return this.formatBoolean(value);
        case 'email':
          return `<a href="mailto:${value}" class="table-link">${value}</a>`;
        case 'phone':
          return this.formatPhone(value);
        case 'cpf':
          return this.formatCpf(value);
        default:
          return value;
      }
    },
    
    formatDate(value) {
      if (!value) return '-';
      try {
        const date = new Date(value);
        return date.toLocaleDateString('pt-BR');
      } catch (e) {
        return value;
      }
    },
    
    formatDateTime(value) {
      if (!value) return '-';
      try {
        const date = new Date(value);
        return date.toLocaleString('pt-BR');
      } catch (e) {
        return value;
      }
    },
    
    formatCurrency(value) {
      if (value === null || value === undefined) return '-';
      return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    },
    
    formatNumber(value) {
      if (value === null || value === undefined) return '-';
      return Number(value).toLocaleString('pt-BR');
    },
    
    formatBoolean(value) {
      if (value === true || value === 1 || value === 'true' || value === 'sim' || value === 'yes') {
        return '<span class="badge badge-success">Sim</span>';
      }
      return '<span class="badge badge-error">Não</span>';
    },
    
    formatPhone(value) {
      if (!value) return '-';
      
      // Remove caracteres não numéricos
      const numbers = String(value).replace(/\D/g, '');
      
      if (numbers.length <= 10) { // Telefone fixo
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else { // Celular
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    },
    
    formatCpf(value) {
      if (!value) return '-';
      
      // Remove caracteres não numéricos
      const numbers = String(value).replace(/\D/g, '');
      
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    // Métodos para ordenação
    sortBy(column) {
      if (!column.sortable) return;
      
      // Se estamos ordenando a mesma coluna, inverte a ordem
      if (this.sortKey === column.key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = column.key;
        this.sortOrder = 'asc';
      }
      
      // Evento para informar sobre a mudança na ordenação
      this.$emit('sort-changed', { key: this.sortKey, order: this.sortOrder });
    },
    
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fas fa-sort';
      return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    
    // Métodos para controle de pesquisa
    handleSearch() {
      // Implementa debounce para evitar muitas filtragens durante digitação
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1; // Volta para a primeira página ao pesquisar
        this.$emit('search', this.searchQuery);
      }, 300);
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.handleSearch();
    },
    
    // Métodos para paginação
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.$emit('page-changed', this.currentPage);
    },
    
    onItemsPerPageChange() {
      this.$emit('items-per-page-changed', this.itemsPerPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.data-table-container {
  width: 100%;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

// Barra de ações e filtros
.data-table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.search-box {
  position: relative;
  width: 300px;
  
  input {
    width: 100%;
    padding: 0.625rem 2.5rem 0.625rem 2.5rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--green-500);
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
    }
  }
  
  i.fa-search {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
  
  i.fa-times-circle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: var(--gray-600);
    }
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

// Tabela
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
  
  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--gray-200);
    white-space: nowrap;
  }
  
  th {
    font-weight: 600;
    color: var(--gray-700);
    background-color: var(--gray-50);
    
    &.sortable {
      cursor: pointer;
      transition: background-color 0.2s;
      user-select: none;
      
      &:hover {
        background-color: var(--gray-100);
      }
      
      i {
        margin-left: 0.25rem;
        color: var(--gray-400);
      }
    }
  }
  
  tr {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--gray-50);
    }
  }
  
  .actions-column {
    text-align: right;
    width: 120px;
  }
  
  .actions-cell {
    text-align: right;
    
    button, a {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gray-500);
      transition: color 0.2s;
      padding: 0.25rem;
      margin: 0 0.125rem;
      
      &:hover {
        color: var(--gray-800);
      }
      
      &.edit-button:hover {
        color: var(--blue-600);
      }
      
      &.delete-button:hover {
        color: var(--red-600);
      }
    }
  }
  
  .loading-row, .empty-row {
    td {
      padding: 3rem 1rem;
      text-align: center;
    }
  }
  
  .spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--gray-500);
    
    i {
      font-size: 1.5rem;
      color: var(--green-500);
    }
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--gray-500);
    
    i {
      font-size: 1.5rem;
      opacity: 0.6;
    }
  }
  
  .table-link {
    color: var(--blue-600);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

// Paginação
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--gray-200);
  background-color: var(--gray-50);
  font-size: 0.875rem;
}

.pagination-info {
  color: var(--gray-600);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-button {
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
    border-color: var(--gray-400);
  }
  
  &.active {
    background-color: var(--green-500);
    border-color: var(--green-500);
    color: var(--white);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  color: var(--gray-500);
}

.pagination-limit {
  select {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    background-color: var(--white);
    font-size: 0.875rem;
    color: var(--gray-700);
    cursor: pointer;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--green-500);
    }
  }
}

// Responsivo
@media (max-width: 768px) {
  .data-table-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-box {
    width: 100%;
  }
  
  .table-pagination {
    flex-direction: column;
    gap: 1rem;
  }
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
