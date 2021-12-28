class Node {
    value = null;
    axis = null;
    leftChild = null;
    rightChild = null;
    constructor(value, axis) {
        this.value = value;
        this.axis = axis;
    }
}

export default class KdTree {
    #root;

    constructor(pointList) {
        const axes = Object.getOwnPropertyNames(pointList[0]);
        const iter = KdTree.iter(pointList, axes);
        this.#root = iter;
    }

    static medianFunc(list, axes, currentAxis) {
        const sorted = [...list].sort((v1, v2) => {
            return v1[currentAxis] - v2[currentAxis];
        });
        const isOdd = sorted.length % 2 === 0;
        if(!isOdd) {
            const index = Math.floor(sorted.length / 2)
            return [
                sorted[index],
                sorted,
            ];
        }
        // const baseIndex = sorted.length / 2;
        // const m1 = sorted[baseIndex - 1];
        // const m2 = sorted[baseIndex];
        // const medianValue = axes.reduce((prev, current, v) => {
        //     prev[current] = (m1[current] + m2[current]) / 2;
        //     return prev;
        // }, {});
        return [
            sorted[sorted.length / 2],
            sorted,
        ];
    }

    static iter(list, axes, depth = 0) {
        const axisIndex = depth % axes.length;
        const axis = axes[axisIndex];
        const [median, sortedList] = KdTree.medianFunc(list, axes, axis);
        const beforeList = sortedList.splice(
            0,
            sortedList.length % 2 == 0
                ? sortedList.length / 2
                : Math.floor(sortedList.length / 2)
        );
        const afterList = sortedList;
        const node = new Node(median, axis);
        if(beforeList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.leftChild = null;
        } else if(beforeList.length === 1) {
            node.leftChild = new Node(beforeList[0]);
        } else {
            node.leftChild = KdTree.iter(beforeList, axes, depth + 1);
        }
        if(afterList.length === 0) {
            // NOTE: 0 のときにわざわざこの処理をする必要はなさそう
            node.rightChild = null;
        } else if(afterList.length === 1) {
            node.rightChild = new Node(afterList[0]);
        } else {
            node.rightChild = KdTree.iter(afterList, axes, depth + 1);
        }
        return node;
    }
}