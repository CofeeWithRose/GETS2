import { TaskSequence } from "../../../managers/task/interface/config/TaskMnagerConfigInterface";

export interface TaskOptions {

  /**
   * 越小越先执行.
   */
  priority: number

   /**
   * 优先级权重较大.
   * 同优先级内,同组的在一起执行.
   */
  group: string

  sequence: TaskSequence
}
export default  interface TaskFolwInterface {
    /**
    * 
    *按照优先级注册task. 
    * @param priority 优先级 > 0.
    * @param task 执行的方法.
    * @returns 任务的ID.
    */
   addTask (task: Function, options: TaskOptions ): number;

   /**
    * 总任务队列中删除任务.
    * @param taskId 被删除的任务的 taskId.
    */
   deleteTask (taskId:number): void;

   /**
    * 按照优先级执行task.
    */
   runAsyncTask(time: number): Promise<void>;

   /**
    * 按照优先级执行task.
    */
   runTask(time: number): void;



   clearAll(): void ;

   runTasks(taskIdList: number[]): void
}