import {storageGetKey, storageSetKey} from "../shared_modules/chrome_helper";

type TargetState = "yes" | "no" | "undetermined";

interface Target {
  id: string,
  rootElement: HTMLElement
}

type TargetData = {
  readonly state: TargetState;
  readonly notes?: string;
  readonly rvPrice?: string;
  readonly insightsPrice?: string;
  readonly homesPrice?: string;
  readonly beoPrice?: string;
  readonly lastUpdated?: string;
}

interface StatefulTarget extends Target {
  data: TargetData,

  updateData(newPartialData: Partial<TargetData>): Promise<void>
}

const defaultTargetData = {
  state: "undetermined",
  notes: null,
  rvPrice: null,
  insightsPrice: null,
  homesPrice: null,
  beoPrice: null,
  lastUpdated: null
};

async function newStatefulTarget(target: Target): Promise<StatefulTarget> {
  const data = {
    ...await storageGetKey(target.id, defaultTargetData) as TargetData
  };

  function updateData(newPartialData: Partial<TargetData>): Promise<void> {
    return storageSetKey(target.id, {
      ...data,
      ...newPartialData
    }).then(() => {
      Object.assign(data, newPartialData);
    })
  }

  return {
    ...target,
    data: {
      get state(): TargetState {
        return data.state;
      },

      get notes(): string {
        return data.notes;
      },

      get rvPrice(): string {
        return data.rvPrice;
      },

      get insightsPrice(): string {
        return data.insightsPrice;
      },

      get homesPrice(): string {
        return data.homesPrice;
      },

      get beoPrice(): string {
        return data.beoPrice;
      },

      get lastUpdated(): string {
        return data.lastUpdated;
      }
    },

    updateData
  };
}

export {TargetState, TargetData, Target, StatefulTarget, newStatefulTarget};
