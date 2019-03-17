import {storageGetKey, storageSetKey} from "../shared_modules/chrome_helper";

type TargetState = "yes" | "no" | "undetermined";

interface Target {
  id: string,
  rootElement: HTMLElement
}

type TargetData = {
  readonly state: TargetState;
  readonly notes?: string;
}

interface StatefulTarget extends Target {
  data: TargetData,

  updateData(newPartialData: Partial<TargetData>): Promise<void>
}

const defaultTargetData = {
  state: "undetermined",
  notes: null
};

async function updateTargetData(id: string, data: TargetData, {...newPartialData}: Partial<TargetData>): Promise<void> {
  return storageSetKey(id, {
    ...data,
    ...newPartialData
  }).then(() => {
    Object.assign(data, newPartialData);
  });
}

async function newStatefulTarget(target: Target): Promise<StatefulTarget> {
  const data = await storageGetKey(target.id, defaultTargetData) as TargetData;

  return {
    ...target,
    data: {
      get state(): TargetState {
        return data.state;
      },

      get notes(): string {
        return data.notes;
      }
    },

    updateData: (newPartialData: Partial<TargetData>) => {
      return updateTargetData(target.id, data, newPartialData);
    }
  };
}

export {TargetState, TargetData, Target, StatefulTarget, newStatefulTarget};
