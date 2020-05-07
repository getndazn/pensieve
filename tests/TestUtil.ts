import { IMock, Mock, MockBehavior } from "typemoq"

export class TestUtil {

  /**
   * Get a mock for the given class.
   *
   * @param strict boolean Whether the mock should have the behavior strict or not.
   */
  public static mock<T>(strict = true): IMock<T> {
    return Mock.ofType<T>(undefined, strict ? MockBehavior.Strict : MockBehavior.Loose, false)
  }

  /**
   * Get a mock using existing objects for the given class.
   *
   * @param instance
   * @param strict boolean Whether the mock should have the behavior strict or not.
   */
  public static mockOfInstance<T>(instance: T, strict = true): IMock<T> {
    const instanceMock = Mock.ofInstance(
      instance,
      strict ? MockBehavior.Strict : MockBehavior.Loose,
      false)
    instanceMock.callBase = true

    return instanceMock
  }
}
