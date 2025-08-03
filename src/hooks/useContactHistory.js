import { useReducer, useEffect } from 'react';

// Tipos de acciones
export const HISTORY_ACTIONS = {
  ADD_ACTION: 'ADD_ACTION',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  LOAD_HISTORY: 'LOAD_HISTORY',
  FILTER_BY_TYPE: 'FILTER_BY_TYPE',
  FILTER_BY_DATE: 'FILTER_BY_DATE'
};

// Tipos de acciones de contacto
export const CONTACT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW'
};

// Estado inicial
const initialState = {
  history: [],
  filteredHistory: [],
  filters: {
    type: 'ALL',
    dateRange: 'ALL'
  }
};

// Reducer para manejar el historial
const historyReducer = (state, action) => {
  switch (action.type) {
    case HISTORY_ACTIONS.ADD_ACTION: {
      const newAction = {
        id: Date.now() + Math.random(),
        type: action.payload.type,
        contactName: action.payload.contactName,
        contactId: action.payload.contactId,
        timestamp: new Date().toISOString(),
        details: action.payload.details || null
      };

      // Mantener máximo 50 entradas (eliminar las más antiguas)
      const updatedHistory = [newAction, ...state.history].slice(0, 50);
      
      const newState = {
        ...state,
        history: updatedHistory
      };

      // Aplicar filtros actuales
      return {
        ...newState,
        filteredHistory: applyFilters(updatedHistory, state.filters)
      };
    }

    case HISTORY_ACTIONS.CLEAR_HISTORY: {
      return {
        ...state,
        history: [],
        filteredHistory: []
      };
    }

    case HISTORY_ACTIONS.LOAD_HISTORY: {
      const loadedHistory = action.payload || [];
      return {
        ...state,
        history: loadedHistory,
        filteredHistory: applyFilters(loadedHistory, state.filters)
      };
    }

    case HISTORY_ACTIONS.FILTER_BY_TYPE: {
      const newFilters = {
        ...state.filters,
        type: action.payload
      };
      
      return {
        ...state,
        filters: newFilters,
        filteredHistory: applyFilters(state.history, newFilters)
      };
    }

    case HISTORY_ACTIONS.FILTER_BY_DATE: {
      const newFilters = {
        ...state.filters,
        dateRange: action.payload
      };
      
      return {
        ...state,
        filters: newFilters,
        filteredHistory: applyFilters(state.history, newFilters)
      };
    }

    default:
      return state;
  }
};

// Función para aplicar filtros
const applyFilters = (history, filters) => {
  let filtered = [...history];

  // Filtrar por tipo
  if (filters.type !== 'ALL') {
    filtered = filtered.filter(action => action.type === filters.type);
  }

  // Filtrar por fecha
  if (filters.dateRange === 'LAST_7_DAYS') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    filtered = filtered.filter(action => new Date(action.timestamp) >= sevenDaysAgo);
  }

  return filtered;
};

// Hook personalizado
export const useContactHistory = () => {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  // Cargar historial desde localStorage al inicializar
  useEffect(() => {
    const savedHistory = localStorage.getItem('contactHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        dispatch({ type: HISTORY_ACTIONS.LOAD_HISTORY, payload: parsedHistory });
      } catch (error) {
        console.error('Error loading history from localStorage:', error);
      }
    }
  }, []);

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (state.history.length > 0) {
      localStorage.setItem('contactHistory', JSON.stringify(state.history));
    }
  }, [state.history]);

  // Función para agregar una nueva acción
  const addAction = (type, contactName, contactId, details = null) => {
    dispatch({
      type: HISTORY_ACTIONS.ADD_ACTION,
      payload: { type, contactName, contactId, details }
    });
  };

  // Función para limpiar el historial
  const clearHistory = () => {
    dispatch({ type: HISTORY_ACTIONS.CLEAR_HISTORY });
    localStorage.removeItem('contactHistory');
  };

  // Función para filtrar por tipo
  const filterByType = (actionType) => {
    dispatch({ type: HISTORY_ACTIONS.FILTER_BY_TYPE, payload: actionType });
  };

  // Función para filtrar por fecha
  const filterByDate = (dateRange) => {
    dispatch({ type: HISTORY_ACTIONS.FILTER_BY_DATE, payload: dateRange });
  };

  // Función para obtener estadísticas
  const getStats = () => {
    const { history } = state;
    return {
      total: history.length,
      creates: history.filter(a => a.type === CONTACT_ACTIONS.CREATE).length,
      updates: history.filter(a => a.type === CONTACT_ACTIONS.UPDATE).length,
      deletes: history.filter(a => a.type === CONTACT_ACTIONS.DELETE).length,
      views: history.filter(a => a.type === CONTACT_ACTIONS.VIEW).length
    };
  };

  return {
    history: state.filteredHistory,
    allHistory: state.history,
    filters: state.filters,
    addAction,
    clearHistory,
    filterByType,
    filterByDate,
    getStats
  };
};