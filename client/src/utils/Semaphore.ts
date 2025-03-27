/**
 * Semaphore 클래스
 *
 * 동시에 실행할 수 있는 작업의 수를 제한하는 동기화 메커니즘입니다.
 * 최대 permits 수만큼의 작업이 동시에 실행될 수 있으며,
 * 그 이상의 작업은 대기 상태에 놓이게 됩니다.
 */
export class Semaphore {
  private permits: number; // 사용 가능한 허가 수
  private waitingQueue: Array<() => void> = []; // 대기 중인 작업 큐

  /**
   * Semaphore 생성자
   * @param permits 동시에 실행 가능한 최대 작업 수
   */
  constructor(permits: number) {
    this.permits = permits;
  }

  /**
   * 세마포어 획득 (비동기)
   * 허가를 획득할 때까지 대기합니다.
   * @returns 허가 획득 시 resolve되는 Promise
   */
  async acquire(): Promise<void> {
    if (this.permits > 0) {
      // 허가가 있으면 즉시 획득
      this.permits--;
      return Promise.resolve();
    } else {
      // 허가가 없으면 대기 큐에 추가
      return new Promise<void>((resolve) => {
        this.waitingQueue.push(() => {
          this.permits--;
          resolve();
        });
      });
    }
  }

  /**
   * 세마포어 해제
   * 대기 중인 다음 작업이 있으면 해당 작업을 깨웁니다.
   */
  release(): void {
    if (this.waitingQueue.length > 0) {
      // 대기 중인 작업이 있으면 첫 번째 작업 실행
      const nextTask = this.waitingQueue.shift();
      if (nextTask) {
        nextTask();
      }
    } else {
      // 대기 중인 작업이 없으면 허가 수 증가
      this.permits++;
    }
  }

  /**
   * 현재 사용 가능한 허가 수 반환
   */
  getAvailablePermits(): number {
    return this.permits;
  }

  /**
   * 대기 중인 작업 수 반환
   */
  getQueueLength(): number {
    return this.waitingQueue.length;
  }
}

export default Semaphore;
