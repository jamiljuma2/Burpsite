import create from 'zustand';

const useRequestStore = create((set, get) => ({
  requests: [],
  selectedRequest: null,
  loading: false,

  setRequests: (requests) => set({ requests }),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
  removeRequest: (id) => set((state) => ({
    requests: state.requests.filter((r) => r.id !== id),
  })),
  clearRequests: () => set({ requests: [] }),
}));

export default useRequestStore;
