export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any>;
  private servicesByName: Map<string, any>;

  private constructor() {
    this.services = new Map<string, any>();
    this.servicesByName = new Map<string, any>();
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public register(name: string, service: any): void {
    this.services.set(name, service);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.servicesByName.set(service.name, service);
  }

  public get(name: string): any {
    return this.services.get(name);
  }

  public getByName(name: string): any {
    return this.servicesByName.get(name);
  }
}
