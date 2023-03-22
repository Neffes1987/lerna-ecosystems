Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  })),
});
