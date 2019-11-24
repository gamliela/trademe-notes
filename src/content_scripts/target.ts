import {GET_DOC_REQUEST, SET_DOC_REQUEST, sendMessage} from "../shared_modules/chrome_messaging";

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
  readonly dueDate?: string;
  readonly lastUpdated?: string;
}

interface StatefulTarget extends Target {
  data: TargetData,

  updateData(newPartialData: Partial<TargetData>): Promise<void>
}

const defaultTargetData: TargetData = {
  state: "undetermined",
  notes: null,
  rvPrice: null,
  insightsPrice: null,
  homesPrice: null,
  beoPrice: null,
  dueDate: null,
  lastUpdated: null
};

async function newStatefulTarget(target: Target): Promise<StatefulTarget> {
  const data = {
    ...(await sendMessage<string, TargetData>(GET_DOC_REQUEST, target.id)) || defaultTargetData
  };

  async function updateData(newPartialData: Partial<TargetData>): Promise<void> {
    console.log("updateData: saving...", newPartialData);
    await sendMessage(SET_DOC_REQUEST, {
      id: target.id,
      data: {
        ...data,
        ...newPartialData
      }
    });
    Object.assign(data, newPartialData);
    console.log(`updateData: success! (${target.id})`);
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

      get dueDate(): string {
        return data.dueDate;
      },

      get lastUpdated(): string {
        return data.lastUpdated;
      }
    },

    updateData
  };
}

export {TargetState, TargetData, Target, StatefulTarget, newStatefulTarget};
