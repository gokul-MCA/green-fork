import type { Message } from "./types";

// time based menu
export function getDynamicMenu(dynamicText: HTMLElement | null) {
  const now: Date = new Date();
  const hour: number = now.getHours();
  const minute: number = now.getMinutes();
  const currentMintues: number = hour * 60 + minute;

  const messages: Message[] = [
    {
      start: 6 * 60 + 59,
      end: 10 * 60 + 15,
      text: "Good Morning! Breakfast available",
      class: "morning-items",
    }, // 07:00 - 10:15 -> 7 - 10:15

    {
      start: 11 * 60 + 59,
      end: 14 * 60 + 5,
      text: "Good Afternoon! Meals available",
      class: "afternoon-items",
    }, // 12:00 - 14:05 -> 12 - 2:05
    {
      start: 16 * 60 + 29,
      end: 19 * 60 + 0,
      text: "Good Evening! Snacks available",
      class: "evening-items",
    }, // 16:30 - 19:00 -> 4:30 - 7
    {
      start: 19 * 60 + 59,
      end: 23 * 60 + 0,
      text: "Good Night! Dinner available",
      class: "night-items",
    }, // 19:00 - 23:00 -> 7-11
  ];

  if (!dynamicText) {
    // Element missing - cannot update UI
    return;
  }

  // Try to find active message based on current time
  let message = messages.find(
    ({ start, end }) => currentMintues >= start && currentMintues <= end
  );

  // Find the next available message (in future)
  if (!message) {
    let nextAvailableSlot = messages.find(
      ({ start }) => currentMintues < start
    );

    let timeUntilNextSlot: number | undefined;
    if (nextAvailableSlot) {
      timeUntilNextSlot = nextAvailableSlot.start - currentMintues;
    } else {
      // If no future slot today, wrap to first slot tomorrow
      const firstItem = messages[0];
      if (firstItem) {
        timeUntilNextSlot = 24 * 60 - currentMintues + firstItem.start;
        nextAvailableSlot = firstItem;
      }
    }

    function formatMinutesToHHMM(minutes: number) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins.toString().padStart(2, "0")}m`;
    }

    if (timeUntilNextSlot === undefined || !nextAvailableSlot) {
      // No messages at all - exit or handle gracefully
      dynamicText.innerHTML = "No messages available";
      return;
    }

    const formattedTime = formatMinutesToHHMM(timeUntilNextSlot);

    let formattedTimeWithCss = `<span class="slot-available-time">${formattedTime}</span>`;

    message = {
      text: `Ready in ⏰ ${formattedTimeWithCss}`,
      class: nextAvailableSlot.class,
      start: 0,
      end: 0,
    };
  }

  // Update dynamic text
  dynamicText.innerHTML = message.text;

  const currentItems = document.getElementsByClassName(message.class);
  for (let i = 0; i < currentItems.length; i++) {
    (currentItems[i] as HTMLElement).style.display = "flex";
  }
}
