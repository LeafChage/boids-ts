
  public generate = (): Simulater<V> => {
    return new SimulateFn<V>(this.actions);
  }
